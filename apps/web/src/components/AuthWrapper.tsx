import * as React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as localforage from 'localforage'

export function AuthWrapper({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const { status, data } = useSession()

  const [isTokensSet, setIsTokensSet] = React.useState(false)

  React.useEffect(() => {
    ;(async function runSessionEffect() {
      if (status === 'unauthenticated') {
        setIsTokensSet(false)
        router.push(`/auth/login?redirectUrl=${router.asPath}`)
      } else {
        await localforage.setItem('access_token', data?.user.accessToken)
        setIsTokensSet(true)
      }
    })()
  }, [data?.user.accessToken, status, router])

  if (status === 'loading' || status === 'unauthenticated') return null

  return isTokensSet ? <>{children}</> : null
}
