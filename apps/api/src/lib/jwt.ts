import jwt from 'jsonwebtoken'
import { env } from '@/env'
import { HttpError } from './error'

export function generateAccessToken(userId: string) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      { userId },
      env.ACCESS_TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' },
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
      if (err || !decoded) {
        throw new HttpError(401, 'Unauthorized')
      }

      const payload = decoded as { userId: string }

      return resolve(payload.userId)
    })
  })
}
