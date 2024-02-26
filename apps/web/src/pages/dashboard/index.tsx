import * as React from 'react'
import { Button } from 'react-aria-components'
import { Layout } from '@/components/Layout'
import { useGetProfile } from '@/hooks/useGetProfile'

export default function Dashboard() {
  const { data } = useGetProfile()

  const account = data?.account
  const wallets = account?.wallets

  return (
    <section>
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-5">
        <div className="flex gap-8">
          {(wallets ?? []).reverse().map(wallet => {
            return (
              <div key={wallet.id} className="">
                <h2 className="mb-2 capitalize">{wallet.type} balance</h2>

                <p className="mb-4 text-2xl font-semibold">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    useGrouping: true,
                    signDisplay: 'auto',
                    maximumFractionDigits: 2,
                  }).format(wallet.balance)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-5">
        <div className="flex gap-4">
          <Button className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white">
            Send
          </Button>
          <Button className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white">
            Receive
          </Button>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Latest Transactions</h2>

        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-5"></div>
      </section>
    </section>
  )
}

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}
