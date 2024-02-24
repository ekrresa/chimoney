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
