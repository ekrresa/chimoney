import { httpRequest } from '@/lib/request'
import { CreateChimoneyAccountResponse } from './types'

type CreateChimoneyAccountInput = {
  name: string
  email: string
  userId: string
}
export async function createChimoneyAccount(input: CreateChimoneyAccountInput) {
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
