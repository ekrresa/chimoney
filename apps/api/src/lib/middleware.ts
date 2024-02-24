import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export function validateRequestBody(schema: z.ZodTypeAny) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await schema.parseAsync(req.body)

    next()
  }
}

// export function AuthenticateUser(req: Request, _res: Response, next: NextFunction) {
//   const token = req.headers.authorization?.split(' ')[1]
// }
