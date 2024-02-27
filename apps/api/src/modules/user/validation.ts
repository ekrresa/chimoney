import { z } from 'zod'

export const NewUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8),
})
export type NewUserInput = z.infer<typeof NewUserSchema>

export const LoginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8),
})
export type LoginInput = z.infer<typeof LoginSchema>

export const VerifyEmailSchema = z.object({
  code: z.string().length(6, 'Invalid code'),
})
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>
