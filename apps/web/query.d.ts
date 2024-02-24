/* eslint-disable no-unused-vars */
import '@tanstack/react-query'
import type { AxiosError } from 'axios'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError<BaseError>
  }
}

type BaseError = {
  message: string
}
