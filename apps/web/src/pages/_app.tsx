import * as React from 'react'
import { NextPage } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider, signOut } from 'next-auth/react'
import type { AppProps } from 'next/app'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import localforage from 'localforage'
import { Toaster } from 'sonner'

import { REFRESH_TOKEN_QUERY_KEY } from '@/lib/constants'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            staleTime: 1000 * 60,
          },
        },
        queryCache: new QueryCache({
          onError: async error => {
            if (error.response?.status === 401) {
              const accessToken = await localforage.getItem('access_token')
              if (!accessToken) {
                return await signOut()
              }

              await queryClient.fetchQuery({ queryKey: [REFRESH_TOKEN_QUERY_KEY] })
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: async error => {
            if (error.response?.status === 401) {
              const accessToken = await localforage.getItem('access_token')
              if (!accessToken) {
                return await signOut()
              }

              await queryClient.fetchQuery({ queryKey: [REFRESH_TOKEN_QUERY_KEY] })
            }
          },
        }),
      }),
  )

  const getLayout = Component.getLayout ?? (page => page)

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        session={session}
        refetchOnWindowFocus={process.env.NODE_ENV === 'production'}
      >
        <main className={inter.variable}>
          {getLayout(<Component {...pageProps} />)}

          <Toaster duration={4000} position="top-right" />
        </main>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}
