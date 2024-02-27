import axios, { AxiosRequestConfig } from 'axios'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

import { env } from '~/env/index.mjs'

const requestConfig = {
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 5000, // timeout after 5 seconds
} satisfies AxiosRequestConfig

export const request = axios.create(requestConfig)
export const authRequest = axios.create(requestConfig)

export function setAccessToken(accessToken: string) {
  authRequest.interceptors.request.use(
    async config => {
      console.log({ accessToken })
      config.headers['Authorization'] = `Bearer ${accessToken}`

      return config
    },
    error => Promise.reject(error),
  )
}

authRequest.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login')
      return await signOut({ redirect: false })
    }

    return Promise.reject(error)
  },
)
