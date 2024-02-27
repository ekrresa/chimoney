import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const userStatusEnum = pgEnum('status', ['active', 'inactive'])

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    accountId: varchar('account_id', { length: 255 }),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerifiedAt: timestamp('email_verified_at', { mode: 'string' }),
    phoneNumber: varchar('phone_number', { length: 100 }),
    status: userStatusEnum('status').notNull().default('inactive'),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  table => {
    return {
      emailIndex: uniqueIndex('email_idx').on(table.email),
    }
  },
)

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    userId: varchar('user_id', { length: 255 }).notNull(),
    code: varchar('code', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  },
  table => ({
    compoundKey: primaryKey({ columns: [table.userId, table.code] }),
  }),
)
