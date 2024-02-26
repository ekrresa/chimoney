import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  if (err instanceof ZodError) {
    const errors = err.flatten().fieldErrors
    return res.status(400).json({ message: 'Request body is invalid', errors })
  }

  res.status(500).json({ message: 'Internal server error' })
}

export class HttpError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    Error.captureStackTrace(this, this.constructor)

    this.name = 'HttpError'
    this.message = message
    this.statusCode = statusCode
  }
}
