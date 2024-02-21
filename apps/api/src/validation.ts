import { z } from 'zod'

export const newUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8),
})

export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
})
