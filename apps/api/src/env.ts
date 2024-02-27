import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import 'dotenv/config'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    ACCESS_TOKEN_SECRET: z.string().min(1),
    POSTMARK_API_KEY: z.string().min(1),
    CHIMONEY_API_KEY: z.string().min(1),
    CHIMONEY_BASE_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: Boolean(process.env.CI),
})
