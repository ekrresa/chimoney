import { authRequest } from '@/lib/request'
import { GenericResponse } from '../types'
import { UserProfile } from './types'

async function getUserProfile() {
  const response = await authRequest.get<GenericResponse<UserProfile>>('/user/me')

  return response.data.data
}

export const UserService = {
  getUserProfile,
}
