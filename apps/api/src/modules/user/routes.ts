import { Router } from 'express'

import { validateRequestBody } from '@/lib/middleware'
import {
  LoginSchema,
  LogoutSchema,
  NewUserSchema,
  VerifyEmailSchema,
} from './validation'
import * as AuthHandler from './auth-handler'

export const authRouter: Router = Router()
export const userRouter: Router = Router()

authRouter.post('/login', validateRequestBody(LoginSchema), AuthHandler.loginUser)

authRouter.post(
  '/signup',
  validateRequestBody(NewUserSchema),
  AuthHandler.signupUser,
)

authRouter.post('/logout', validateRequestBody(LogoutSchema), AuthHandler.logoutUser)

authRouter.post(
  '/verify',
  validateRequestBody(VerifyEmailSchema),
  AuthHandler.verifyUserEmail,
)

userRouter.get('/me', (req, res) => {
  res.send('me')
})

userRouter.post('/profile', (req, res) => {
  res.send('profile')
})
