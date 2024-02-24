import { createHash } from 'node:crypto'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '@/env'

export function hashPassword(password: string) {
  return bcrypt.hash(sha256(password), 10)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(sha256(password), hash)
}

function sha256(plaintext: string) {
  return createHash('sha256').update(plaintext).digest('base64')
}

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
