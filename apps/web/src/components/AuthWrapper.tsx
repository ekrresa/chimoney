import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { setAccessToken } from '@/lib/request'

export function AuthWrapper({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const { status, data } = useSession()

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/login?redirectUrl=${router.asPath}`)
    }

    if (status === 'authenticated') {
      setAccessToken(data?.user.accessToken ?? '')
    }
  }, [data?.user.accessToken, status, router])

  if (status !== 'authenticated') return null

  return <>{children}</>
}
