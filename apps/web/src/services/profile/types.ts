import { ChimoneyAccount } from '../types'

export type UserProfile = {
  user: {
    id: string
    email: string
    status: 'active' | 'inactive'
    name: string
    accountId: string | null
    emailVerifiedAt: string | null
    phoneNumber: string | null
    createdAt: string
    updatedAt: string
  }
  account: ChimoneyAccount
}
