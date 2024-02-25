import { Router } from 'express'

import { authRouter, userRouter } from '@/modules/user/routes'

export const router: Router = Router({ mergeParams: true })

router.use('/auth', authRouter)
router.use('/users', userRouter)
