import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { sessions, users, verificationTokens } from '@/db/schema'
import { addHours } from 'date-fns'

type NewUser = typeof users.$inferInsert
type NewSession = typeof sessions.$inferInsert

export async function activateNewUser(userId: string, accountId: string) {
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

export async function deleteUser(userId: string) {
  await db.delete(users).where(eq(sessions.userId, userId))
}

export async function deleteUserSession(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId))
}

export async function saveUserSession(session: NewSession) {
  await db
    .insert(sessions)
    .values({
      userId: session.userId,
      refreshToken: session.refreshToken,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: sessions.userId,
      set: { refreshToken: session.refreshToken },
    })
}

export async function getVerificationCode(verificationCode: string) {
  const [result] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.code, verificationCode))

  return result
}

export async function getUserById(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  return user
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  return user
}

export async function saveVerificationCode(userId: string) {
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

export async function saveUser(newUser: NewUser) {
  const [user] = await db.insert(users).values(newUser).returning()

  return user
}
