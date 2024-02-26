import { Layout } from '@/components/Layout'
import React from 'react'

export default function Transactions() {
  return <div>transactions</div>
}

Transactions.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}
