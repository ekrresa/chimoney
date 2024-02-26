import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

import { HttpError } from './error'
import { session, setRequestUserId } from './session'
import { verifyAccessToken } from './jwt'

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

  verifyAccessToken(token)
    .then(userId => {
      if (!userId) {
        throw new HttpError(401, 'Please login')
      }

      session.run(() => {
        setRequestUserId(userId)
        next()
      })
    })
    .catch(() => {
      throw new HttpError(401, 'Unauthorized B')
    })
}
