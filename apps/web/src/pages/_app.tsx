import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={process.env.NODE_ENV === 'production'}
    >
      <main className={inter.variable}>
        <Component {...pageProps} />
        <Toaster duration={4000} position="top-right" />
      </main>
    </SessionProvider>
  )
}
