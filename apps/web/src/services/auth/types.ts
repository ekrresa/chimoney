import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const verificationCodeSchema = z.object({
  code: z.string().length(6, 'Invalid code'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>

export type AuthResponse = {
  accessToken: string
  refreshToken: string
}
