
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
// import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import { PrismaAdapter } from "@auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"
import prisma from '@/server/db'

import { custom } from 'openid-client';

custom.setHttpOptionsDefaults({
  timeout: 5000,
});


const handler = (req, res) => NextAuth(req, res, {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_CLIENT_ID,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET
    // })

    CredentialsProvider({
      name: 'metamask',
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: credentials.csrfToken,
          })
          console.log('siwe verify', result)

          if (result.success) {
            const existingUser = await prisma.user.findUnique({
              where: {
                id: siwe.address
              }
            });
            console.log('exist', existingUser)

            if (!existingUser) {
              const newUser = await prisma.user.create({
                data: {
                  id: siwe.address,
                  name: siwe.address,
                  address: siwe.address,
                }
              });
              return newUser
            }
            return existingUser
          }
          return null
        } catch (e) {
          console.error(e)
          return null
        }
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/',
  },
  session: {
    // Set to jwt in order to CredentialsProvider works properly
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token, user }: { session: any; token: any }) {
      // console.log('inSession', session, token, user)
      if (token) {
        session.user.name = token.sub
        session.user.address = token.sub
        session.user.image = "https://www.fillmurray.com/128/128"
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }