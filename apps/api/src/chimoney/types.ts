export type CreateChimoneyAccountResponse = {
  status: string
  data: {
    id: string
    parent: string
    uid: string
    approved: boolean
    createdDate: string
    meta: {}
    approvals: [
      {
        changedFields: string[]
        deviceTime: string
        timestamp: string
      },
    ]
    name: string
    verified: boolean
    isScrimUser: boolean
    subAccount: boolean
  }
}

export type ChimoneyAccount = {
  status: 'success'
  data: {
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
