import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users, verificationTokens } from '@/db/schema'
import { addHours } from 'date-fns'

type NewUser = typeof users.$inferInsert

async function activateNewUser(userId: string, accountId: string) {
  await db.transaction(async tx => {
    await tx
      .update(users)
      .set({
        accountId: accountId,
        status: 'active',
        emailVerifiedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))

    await tx.delete(verificationTokens).where(eq(verificationTokens.userId, userId))
  })
}

async function deleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId))
}

async function getVerificationCode(verificationCode: string) {
  const [result] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.code, verificationCode))

  return result
}

async function getUserById(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  return user
}

async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  return user
}

async function saveVerificationCode(userId: string) {
  const code = Math.floor(Math.random() * 899999 + 100000).toString()

  const [result] = await db
    .insert(verificationTokens)
    .values({
      userId: userId,
      code: code,
      expiresAt: addHours(new Date(), 24),
    })
    .returning({ code: verificationTokens.code })

  return result?.code
}

async function saveUser(newUser: NewUser) {
  const [user] = await db.insert(users).values(newUser).returning()

  return user
}

export const UserService = {
  activateNewUser,
  deleteUser,
  getVerificationCode,
  getUserById,
  getUserByEmail,
  saveUser,
  saveVerificationCode,
}
