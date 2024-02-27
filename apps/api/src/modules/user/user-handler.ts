import { Request, Response } from 'express'

import { HttpError } from '@/lib/error'
import { getRequestUserId } from '@/lib/session'
import { UserService } from './service'
import { ChimoneyService } from '@/chimoney/service'

export async function getUserProfile(req: Request, res: Response) {
  const userId = getRequestUserId()

  if (!userId) {
    throw new HttpError(401, 'Unauthorized')
  }

  const user = await UserService.getUserById(userId)
  const chimoneyAccount = await ChimoneyService.getAccountDetails(user?.accountId!)

  if (!user) {
    throw new HttpError(404, 'User not found')
  }

  const { password, ...userWithoutPassword } = user

  return res.status(200).json({
    message: 'user retrieved successfully',
    data: { account: chimoneyAccount, user: userWithoutPassword },
  })
}
