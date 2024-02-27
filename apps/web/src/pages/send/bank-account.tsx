import { Layout } from '@/components/Layout'
import React from 'react'

export default function BankAccount() {
  return <div>W</div>
}

BankAccount.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}
