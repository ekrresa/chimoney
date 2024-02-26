import { request } from '@/lib/request'
import { BaseResponse } from '../types'
import { AuthResponse, LoginInput, SignupInput } from './types'

async function login(input: LoginInput) {
  const response = await request.post<AuthResponse>('/auth/login', input)
  return response.data
}

async function signup(input: SignupInput) {
  const response = await request.post<BaseResponse>('/auth/signup', input)
  return response.data
}

async function verifyEmail(input: { code: string }) {
  const response = await request.post<AuthResponse>('/auth/verify', input)
  return response.data
}

async function logout(refreshToken: string) {
  return await request.post('/auth/logout', { refreshToken })
}

async function refreshAccessToken(refreshToken: string) {
  return await request.post('/auth/tokens/refresh', { refreshToken })
}

export const AuthService = {
  login,
  logout,
  refreshAccessToken,
  signup,
  verifyEmail,
}
