import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { HttpError } from './error'
import { session, setRequestUserId } from './session'
import { env } from '@/env'

export function validateRequestBody(schema: z.ZodTypeAny) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await schema.parseAsync(req.body)

    next()
  }
}

export function checkUserAuth(req: Request, _: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HttpError(401, 'Unauthorized')
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    throw new HttpError(401, 'Unauthorized A')
  }

  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err || !payload) {
      throw new HttpError(401, 'Please login')
    }

    const userData = payload as { userId: string }

    session.run(() => {
      setRequestUserId(userData.userId)
      next()
    })
  })
}
