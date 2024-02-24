import { Request, Response } from 'express'
import { isAfter } from 'date-fns'

import { HttpError } from '@/lib/error'
import * as ChimoneyService from '@/chimoney/service'
import { sendWelcomeEmail } from '@/lib/email'
import * as UserService from './service'
import * as UserUtils from './utils'
import {
  LoginInput,
  LogoutInput,
  NewUserInput,
  VerifyEmailInput,
} from './validation'

export async function loginUser(req: Request, res: Response) {
  const requestBody = <LoginInput>req.body

  const user = await UserService.getUserByEmail(requestBody.email)
  if (!user) {
    throw new HttpError(400, 'Invalid credentials')
  }

  if (user.status === 'inactive') {
    throw new HttpError(400, 'Please verify your email')
  }

  const isPasswordCorrect = await UserUtils.verifyPassword(
    requestBody.password,
    user.password,
  )

  if (!isPasswordCorrect) {
    throw new HttpError(400, 'Invalid credentials')
  }

  const accessToken = await UserUtils.generateAccessToken(user.id)
  const refreshToken = await UserUtils.generateRefreshToken(user.id)

  await UserService.saveUserSession({
    userId: user.id,
    refreshToken: refreshToken,
  })

  return res
    .status(200)
    .json({ message: 'Login successful', data: { accessToken, refreshToken } })
}

export async function signupUser(req: Request, res: Response) {
  const requestBody = <NewUserInput>req.body

  const user = await UserService.getUserByEmail(requestBody.email)
  if (user) {
    throw new HttpError(400, 'User already exists')
  }

  const hashedPassword = await UserUtils.hashPassword(requestBody.password)

  const newUser = await UserService.saveUser({
    name: requestBody.name,
    email: requestBody.email,
    password: hashedPassword,
  })

  if (!newUser) {
    throw new HttpError(500, 'Internal server error')
  }

  const verificationCode = await UserService.saveVerificationCode(newUser.id)

  if (!verificationCode) {
    return res.status(500).json({ message: 'Internal server error' })
  }

  // TODO: Use cron job to send emails
  sendWelcomeEmail({
    code: verificationCode,
    name: newUser.name,
    email: newUser.email,
  })

  return res.status(201).json({ message: 'User created' })
}

export async function logoutUser(req: Request, res: Response) {
  const requestBody = <LogoutInput>req.body

  const userId = await UserUtils.verifyRefreshToken(requestBody.refreshToken)

  await UserService.deleteUserSession(userId)

  return res.status(200).json({ message: 'Logout successful' })
}

export async function verifyUserEmail(req: Request, res: Response) {
  const requestBody = <VerifyEmailInput>req.body

  const verifyResult = await UserService.getVerificationCode(requestBody.code)

  if (!verifyResult) {
    throw new HttpError(400, 'Invalid code')
  }

  if (!isAfter(verifyResult.expiresAt, new Date())) {
    await UserService.deleteUser(verifyResult.userId)

    throw new HttpError(400, 'Your code is expired. Please re-register')
  }

  const user = await UserService.getUserById(verifyResult.userId)

  if (!user) {
    throw new HttpError(500, 'Internal server error')
  }

  const accountResponse = await ChimoneyService.createChimoneyAccount({
    name: user.name,
    email: user.email,
    userId: user.id,
  })

  await UserService.activateNewUser(user.id, accountResponse.id)

  const accessToken = await UserUtils.generateAccessToken(user.id)
  const refreshToken = await UserUtils.generateRefreshToken(user.id)

  await UserService.saveUserSession({
    userId: user.id,
    refreshToken: refreshToken,
  })

  return res
    .status(200)
    .json({ message: 'Email verified', data: { accessToken, refreshToken } })
}
