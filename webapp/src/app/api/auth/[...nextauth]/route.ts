
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
// import { utils } from 'ethers'
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"



const handler = (req, res) => NextAuth(req, res, {
  // Configure one or more authentication providers
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

          if (result.success) {
            // TODO create or get user
            return {
              id: siwe.address,
            }
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/signIn',
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      console.log('inSession', session, token)
      session.address = token.sub
      session.user.name = token.sub
      session.user.image = "https://www.fillmurray.com/128/128"
      return session
    },
  },
})

export { handler as GET, handler as POST }