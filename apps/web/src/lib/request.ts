import axios, { AxiosRequestConfig } from 'axios'
import * as localforage from 'localforage'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

import { env } from '~/env/index.mjs'

const requestConfig = {
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 5000, // timeout after 5 seconds
} satisfies AxiosRequestConfig

export const request = axios.create(requestConfig)
export const authRequest = axios.create(requestConfig)

authRequest.interceptors.request.use(
  async config => {
    const accessToken = await localforage.getItem('access_token')

    if (!accessToken) {
      toast.error('Session expired. Please login.')
      localforage.clear()
      await signOut()
    } else {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    return config
  },
  error => Promise.reject(error),
)
