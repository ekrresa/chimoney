import { env } from '@/env'
import axios from 'axios'

export const httpRequest = axios.create({
  baseURL: env.CHIMONEY_BASE_URL,
  timeout: 5000, // timeout after 5 seconds
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'X-API-KEY': env.CHIMONEY_API_KEY,
  },
})
