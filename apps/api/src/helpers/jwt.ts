import jwt from 'jsonwebtoken'
import { env } from '@/env'
import { db } from '@/db'
import { sessions } from '@/db/schema'

export function generateAccessToken(userId: string) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      { userId },
      env.ACCESS_TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: '5m' },
      (err, token) => {
        if (err) {
          return reject(err)
        }

        return resolve(token!)
      },
    )
  })
}

export function verifyAccessToken(token: string) {
  return new Promise<string>((resolve, reject) => {
    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return reject(err)
      }

      const payload = decoded as { userId: string }

      return resolve(payload.userId)
    })
  })
}

export function generateRefreshToken(userId: string) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      { userId },
      env.REFRESH_TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: '7d' },
      (err, token) => {
        if (err) {
          return reject(err)
        }

        return resolve(token!)
      },
    )
  })
}

export function verifyRefreshToken(token: string) {
  return new Promise<string>((resolve, reject) => {
    jwt.verify(token, env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return reject(err)
      }

      const payload = decoded as { userId: string }

      return resolve(payload.userId)
    })
  })
}

export async function generateSessionTokens(userId: string) {
  const accessToken = await generateAccessToken(userId)
  const refreshToken = await generateRefreshToken(userId)

  await db
    .insert(sessions)
    .values({
      userId: userId,
      refreshToken: refreshToken,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: sessions.userId,
      set: { refreshToken: refreshToken },
    })

  return { accessToken, refreshToken }
}
