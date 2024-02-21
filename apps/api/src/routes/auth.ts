import { eq } from 'drizzle-orm'
import { Router } from 'express'

import { db } from '@/db'
import { sessions, users } from '@/db/schema'
import { hashPassword, verifyPassword } from '@/utils'
import { loginSchema, logoutSchema, newUserSchema } from '@/validation'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/helpers/jwt'

export const authRouter: Router = Router()

authRouter.post('/register', async (req, res) => {
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

  const accessToken = await generateAccessToken(newUser.id)
  const refreshToken = await generateRefreshToken(newUser.id)

  await db.insert(sessions).values({
    userId: newUser.id,
    refreshToken: refreshToken,
  })

  // TODO: Send verify email

  return res
    .status(201)
    .json({ message: 'User created', data: { accessToken, refreshToken } })
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

  console.log(user)

  const isPasswordCorrect = await verifyPassword(credentials.password, user.password)

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const accessToken = await generateAccessToken(user.id)
  const refreshToken = await generateRefreshToken(user.id)

  await db
    .insert(sessions)
    .values({
      userId: user.id,
      refreshToken: refreshToken,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({ target: sessions.userId, set: { refreshToken: refreshToken } })

  return res
    .status(200)
    .json({ message: 'Login successful', data: { accessToken, refreshToken } })
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
