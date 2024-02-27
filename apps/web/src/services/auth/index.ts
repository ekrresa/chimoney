import { request } from '@/lib/request'
import { BaseResponse, GenericResponse } from '../types'
import { AuthResponse, LoginInput, SignupInput } from './types'

async function login(input: LoginInput) {
  const response = await request.post<GenericResponse<AuthResponse>>(
    '/auth/login',
    input,
  )
  return response.data
}

async function signup(input: SignupInput) {
  const response = await request.post<BaseResponse>('/auth/signup', input)
  return response.data
}

async function verifyEmail(input: { code: string }) {
  const response = await request.post<GenericResponse<AuthResponse>>(
    '/auth/verify',
    input,
  )
  return response.data
}

export const AuthService = {
  login,
  signup,
  verifyEmail,
}
