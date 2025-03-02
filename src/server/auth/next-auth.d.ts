import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      name: string
      mfaEnabled: boolean
      mfaVerified: boolean
    } & DefaultSession["user"]
  }

  interface JWT {
    id: string
    mfaEnabled: boolean
    mfaVerified: boolean
  }
}