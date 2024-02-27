import { Layout } from '@/components/Layout'
import React from 'react'

export default function Email() {
  return <div>W</div>
}

Email.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}
