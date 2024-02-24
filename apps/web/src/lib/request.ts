import axios from 'axios'
import { env } from '~/env/index.mjs'

export const request = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 5000, // timeout after 5 seconds
})
