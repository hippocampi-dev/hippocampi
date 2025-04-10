import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema/auth";
import { eq } from "drizzle-orm";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    sessionVerified: boolean,
    user: {
      id: string
      name: string
      mfaEnabled: boolean
      mfaVerified: boolean
    } & DefaultSession["user"]
  }

  interface JWT {
    id: string
    mfaEnabled: boolean // for set up
    mfaVerified: boolean // for set up
    sessionVerified: boolean
  }
}

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    jwt: async ({ token, user, session, trigger }) => {
      if (user) {
        token.id = user.id
        token.name = user.name

        // Fetch MFA status from the database
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id as "string"),
          columns: {
            mfaEnabled: true,
            mfaVerified: true,
          },
        })

        if (dbUser) {
          token.mfaEnabled = dbUser.mfaEnabled
          token.mfaVerified = dbUser.mfaVerified
        }
      }

      if (session) {
        token.sessionVerified = false;
        if (trigger === "update") {
          // console.log('session verified:', session.sessionVerified)
          token.sessionVerified = session.sessionVerified;
          // console.log(session)
        }
      }
      // console.log(token)
      return token
    },
    session: ({ session, token }) => ({
      ...session,
      sessionVerified: token.sessionVerified as boolean,
      user: {
        ...session.user,
        id: token.id as string,
        mfaEnabled: token.mfaEnabled as boolean,
        mfaVerified: token.mfaVerified as boolean,
      },
    }),
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // in seconds, 1 day limit
  },
  secret: process.env.SECRET, // Required for security
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
} satisfies NextAuthConfig;
