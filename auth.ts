import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
// import type { NextAuthConfig } from 'next-auth'
// import { NextResponse } from 'next/server'
import { authConfig } from './auth.config'

export const config = {
  pages: { signIn: '/sign-in', error: '/sign-in' },
  session: { strategy: 'jwt' as const, maxAge: 30 * 24 * 60 * 60 }, // 30 days
  adapter: PrismaAdapter({ prisma }),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials === null) return null
        // Find User in database
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        })
        // check if user exists and passwoed match
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          )

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        // if user does not exist or password does not match
        return null
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      // set the user id from the token
      session.user.id = token.sub
      session.user.role = token.role
      session.user.name = token.name

      // if theres an update , set the name user
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role
        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]

          // Update db to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          })
        }
      }
      return token
    },
    ...authConfig.callbacks,
    // authorized({ request, auth }: any) {
    //   // check for session cart cookie
    //   if (!request.cookies.get('sessionCartId')) {
    //     // generate new session cart id cookie
    //     const sessionCartId = crypto.randomUUID()
    //     // clone the request headers
    //     const newReguestHeaders = new Headers(request.headers)

    //     // create new response and add the new headers
    //     const response = NextResponse.next({
    //       request: {
    //         headers: newReguestHeaders,
    //       },
    //     })
    //     //  set newly generated sessionCart Id in the response cookies
    //     response.cookies.set('sessionCartId', sessionCartId)
    //     return response
    //   } else {
    //     return true
    //   }
    // },
  },
}
export const { handlers, auth, signIn, signOut } = NextAuth(config)
