import { pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerifiedAt: timestamp('email_verified_at', { mode: 'string' }),
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

export const sessions = pgTable(
  'sessions',
  {
    id: varchar('id', { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshToken: text('refresh_token').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  table => {
    return {
      userIdIndex: uniqueIndex('user_id_idx').on(table.userId),
    }
  },
)
