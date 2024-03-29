import { Router } from 'express'

import { checkUserAuth, validateRequestBody } from '@/lib/middleware'
import { LoginSchema, NewUserSchema, VerifyEmailSchema } from './validation'
import * as AuthHandler from './auth-handler'
import * as UserHandler from './user-handler'

export const authRouter: Router = Router()
export const userRouter: Router = Router()

authRouter.post('/login', validateRequestBody(LoginSchema), AuthHandler.loginUser)

authRouter.post(
  '/signup',
  validateRequestBody(NewUserSchema),
  AuthHandler.signupUser,
)

authRouter.post(
  '/verify',
  validateRequestBody(VerifyEmailSchema),
  AuthHandler.verifyUserEmail,
)

userRouter.get('/me', checkUserAuth, UserHandler.getUserProfile)
