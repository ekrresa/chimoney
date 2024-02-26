import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as localforage from 'localforage'
import { useRefreshAccessToken } from '@/hooks/useRefreshAccessToken'

export function AuthWrapper({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const { status, data } = useSession()

  useRefreshAccessToken()

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/login?redirectUrl=${router.asPath}`)
    } else {
      localforage.setItem('access_token', data?.user.accessToken)
      localforage.setItem('refresh_token', data?.user.refreshToken)
    }
  }, [data?.user.accessToken, status, router])

  if (status === 'loading' || status === 'unauthenticated') return null

  return <>{children}</>
}
