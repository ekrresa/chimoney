import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import 'dotenv/config'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    ACCESS_TOKEN_SECRET: z.string().min(1),
    REFRESH_TOKEN_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
