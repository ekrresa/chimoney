import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { AuthService } from '@/services/auth'
import { loginSchema, verificationCodeSchema } from '@/services/auth/types'

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'login',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      //@ts-expect-error
      async authorize(credentials) {
        try {
          const input = await loginSchema.parseAsync(credentials)
          const data = await AuthService.login(input)
          return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }
        } catch (error: any) {
          throw new Error(error?.response?.data?.message)
        }
      },
    }),
    CredentialsProvider({
      id: 'verify',
      credentials: {
        code: { label: 'Code', type: 'text' },
      },
      // @ts-expect-error
      async authorize(credentials) {
        try {
          const input = await verificationCodeSchema.parseAsync(credentials)
          const data = await AuthService.verifyEmail(input)

          return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }
        } catch (error: any) {
          throw new Error(error?.response?.data?.message || 'An error occurred')
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user) return true

      return false
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        }
      }

      return token
    },
    async session({ session, token }) {
      session.user = token.user

      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
  },
})
