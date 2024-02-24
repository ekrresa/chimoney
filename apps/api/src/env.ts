import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import 'dotenv/config'

console.log(typeof process.env.CI)

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.string().url(),
    ACCESS_TOKEN_SECRET: z.string().min(1),
    REFRESH_TOKEN_SECRET: z.string().min(1),
    POSTMARK_API_KEY: z.string().min(1),
    CHIMONEY_API_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  //@ts-expect-error
  skipValidation: process.env.CI === true,
})
