import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { addHours, isAfter } from 'date-fns'
import { renderAsync } from '@react-email/render'
import postmark from 'postmark'

import { db } from '@/db'
import { env } from '@/env'
import { sessions, users, verificationTokens } from '@/db/schema'
import { hashPassword, verifyPassword } from '@/utils'
import {
  loginSchema,
  logoutSchema,
  newUserSchema,
  verifyEmailSchema,
} from '@/validation'
import {
  generateAccessToken,
  generateRefreshToken,
  generateSessionTokens,
  verifyRefreshToken,
} from '@/helpers/jwt'
import { WelcomeEmail } from 'transactional/emails/WelcomeEmail'
import { httpRequest } from '@/helpers/request'

const client = new postmark.ServerClient(env.POSTMARK_API_KEY)

export const authRouter: Router = Router()

authRouter.post('/signup', async (req, res) => {
  const result = await newUserSchema.safeParseAsync(req.body)

  if (!result.success) {
    return res.status(400).json({ message: 'Bad request' })
  }

  const user = result.data

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, user.email))
    .limit(1)

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  user.password = await hashPassword(user.password)

  const [newUser] = await db.insert(users).values(user).returning()

  if (!newUser) {
    return res.status(500).json({ message: 'Internal server error' })
  }

  // TODO: Use cron job to send emails
  const code = Math.floor(Math.random() * 899999 + 100000).toString()

  await db.insert(verificationTokens).values({
    userId: newUser.id,
    code: code,
    expiresAt: addHours(new Date(), 24),
  })

  const emailHtml = await renderAsync(WelcomeEmail({ code: code, name: user.name }))

  const options = {
    From: 'hey@ekrresa.com',
    To: user.email,
    Subject: 'Welcome to PeerCash',
    HtmlBody: emailHtml,
  }

  client.sendEmail(options)

  return res.status(201).json({ message: 'User created' })
})

authRouter.post('/login', async (req, res) => {
  const result = await loginSchema.safeParseAsync(req.body)

  if (!result.success) {
    return res.status(400).json({ message: 'Bad request' })
  }

  const credentials = result.data

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, credentials.email))
    .limit(1)

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  if (user.status === 'inactive') {
    return res.status(400).json({ message: 'Please verify your email' })
  }

  const isPasswordCorrect = await verifyPassword(credentials.password, user.password)

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const { accessToken, refreshToken } = await generateSessionTokens(user.id)

  await db
    .insert(sessions)
    .values({
      userId: user.id,
      refreshToken: refreshToken,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: sessions.userId,
      set: { refreshToken: refreshToken },
    })

  return res
    .status(200)
    .json({ message: 'Login successful', data: { accessToken, refreshToken } })
})

authRouter.post('/verify', async (req, res) => {
  const result = await verifyEmailSchema.safeParseAsync(req.body)

  if (!result.success) {
    return res.status(400).json({ message: 'Bad request' })
  }

  const [verifyResult] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.code, result.data.code))

  if (!verifyResult) {
    return res.status(400).json({ message: 'Invalid code' })
  }

  if (!isAfter(verifyResult.expiresAt, new Date())) {
    return res.status(400).json({ message: 'Code is expired. Please re-register' })
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, verifyResult.userId))
    .limit(1)

  if (!user) {
    return res.status(500).json({ message: 'Internal server error' })
  }

  await httpRequest.post('/sub-account/create', {
    name: user.name,
    email: user.email,
    meta: {
      userId: user.id,
    },
  })

  await db.transaction(async tx => {
    await tx
      .update(users)
      .set({ status: 'active', emailVerifiedAt: new Date().toISOString() })
      .where(eq(users.id, verifyResult.userId))

    await tx
      .delete(verificationTokens)
      .where(eq(verificationTokens.userId, verifyResult.userId))
  })

  const { accessToken, refreshToken } = await generateSessionTokens(
    verifyResult.userId,
  )

  return res
    .status(200)
    .json({ message: 'Email verified', data: { accessToken, refreshToken } })
})

authRouter.post('/logout', async (req, res) => {
  const result = await logoutSchema.safeParseAsync(req.body)

  if (!result.success) {
    return res.status(400).json({ message: 'Bad request' })
  }

  const refreshToken = result.data.refreshToken

  const userId = await verifyRefreshToken(refreshToken)

  await db.delete(sessions).where(eq(sessions.userId, userId))

  return res.status(200).json({ message: 'Logout successful' })
})
