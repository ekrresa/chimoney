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

async function logout(refreshToken: string) {
  return await request.post('/auth/logout', { refreshToken })
}

async function refreshAccessToken(refreshToken: string) {
  return await request.post<GenericResponse<AuthResponse>>('/auth/tokens/refresh', {
    refreshToken,
  })
}

export const AuthService = {
  login,
  logout,
  refreshAccessToken,
  signup,
  verifyEmail,
}
