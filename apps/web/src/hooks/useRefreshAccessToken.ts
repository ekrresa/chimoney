import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import * as localforage from 'localforage'
import { signOut } from 'next-auth/react'

import { AuthService } from '@/services/auth'
import { REFRESH_TOKEN_QUERY_KEY } from '@/lib/constants'

export function useRefreshAccessToken() {
  const { isError } = useQuery({
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryKey: [REFRESH_TOKEN_QUERY_KEY],
    queryFn: async () => {
      const refreshToken = await localforage.getItem<string>('refresh_token')
      if (!refreshToken) {
        return await signOut()
      }

      return AuthService.refreshAccessToken(refreshToken)
    },
    staleTime: 1000 * 60 * 2, // keep data fresh for 2 minutes to dedupe any additional requests within this window
  })

  React.useEffect(() => {
    if (isError) {
      signOut()
    }
  }, [isError])
}
