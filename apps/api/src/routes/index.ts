import { Router } from 'express'
import { authRouter } from './auth'

export const router: Router = Router()

router.use('/auth', authRouter)
