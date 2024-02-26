export type BaseResponse = {
  message: string
}

export interface GenericResponse<T> extends BaseResponse {
  data: T
}

export type ChimoneyAccount = {
  id: string
  parent: string
  uid: string
  approved: boolean
  createdDate: string
  meta: Record<string, string>
  name: 'Mark Jones'
  verified: boolean
  isScrimUser: boolean
  subAccount: boolean
  wallets: ChimoneyWallet[]
}

type ChimoneyWallet = {
  id: string
  owner: string
  balance: number
  type: string
  transactions: ChimoneyWalletTransaction[]
}

type ChimoneyWalletTransaction = {
  amount: number
  balanceBefore: number
  meta: {
    date: {
      _seconds: number
      _nanoseconds: number
    }
  }
  newBalance: number
  description: string
}
