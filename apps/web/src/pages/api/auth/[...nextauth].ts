import { request } from '@/lib/request'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

type AuthResponse = {
  accessToken: string
  refreshToken: string
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'login',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await request.post<AuthResponse>('/auth/login', credentials)
          console.log(response.data)
          return null
        } catch (error) {
          return null
        }
      },
    }),
    CredentialsProvider({
      id: 'signup',
      credentials: {
        name: { label: 'Name', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // @ts-expect-error
      async authorize(credentials) {
        try {
          const response = await request.post<AuthResponse>('/auth/signup', credentials)
          const data = response.data

          return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }
        } catch (error: any) {
          throw new Error(error?.response?.data?.message)
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
