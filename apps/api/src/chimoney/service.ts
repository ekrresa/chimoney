import { httpRequest } from '@/lib/request'
import { ChimoneyAccount, CreateChimoneyAccountResponse } from './types'

type CreateChimoneyAccountInput = {
  name: string
  email: string
  userId: string
}
async function createAccount(input: CreateChimoneyAccountInput) {
  const response = await httpRequest.post<CreateChimoneyAccountResponse>(
    '/sub-account/create',
    {
      name: input.name,
      email: input.email,
      meta: {
        userId: input.userId,
      },
    },
  )

  return response.data.data
}

async function getAccountDetails(accountId: string) {
  const response = await httpRequest.get<ChimoneyAccount>('/sub-account/get', {
    params: {
      id: accountId,
    },
  })

  return response.data.data
}

export const ChimoneyService = {
  createChimoneyAccount: createAccount,
  getAccountDetails,
}
