import { Layout } from '@/components/Layout'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Button } from 'react-aria-components'

export default function Send() {
  const router = useRouter()

  return (
    <div>
      <Button className="mb-6 inline-flex items-center gap-1" onPress={router.back}>
        <ChevronLeftIcon className="h-5 w-5" />
        <p>Back</p>
      </Button>

      <h1 className="mb-4 text-2xl font-bold">Send options</h1>

      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-5">
        <div className="flex flex-col gap-8">
          <Link
            href={'/send/bank-account'}
            className="flex items-center justify-between"
          >
            <p>Send money to bank account</p>
            <ChevronRightIcon />
          </Link>
          <Link href={'/send/wallet'} className="flex items-center justify-between">
            <p>Send money to wallet</p>
            <ChevronRightIcon />
          </Link>
          <Link href={'/send/email'} className="flex items-center justify-between">
            <p>Send money to email</p>
            <ChevronRightIcon />
          </Link>
          <Link href={'/send/airtime'} className="flex items-center justify-between">
            <p>Send airtime</p>
            <ChevronRightIcon />
          </Link>
        </div>
      </div>
    </div>
  )
}

Send.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}
