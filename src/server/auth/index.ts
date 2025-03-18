import NextAuth from "next-auth";
import { cache } from "react";
import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };

// Custom login function to handle MFA
export async function signInWithMfa(credentials: Record<"email" | "password", string>) {
  const user = await signIn("credentials", { ...credentials, redirect: false })

  if (user?.error) {
    throw new Error(user.error);
  }

  const session = await auth()

  if (session?.user.mfaEnabled && !session.user.mfaVerified) {
    return { mfaRequired: true }
  }

  return { success: true }
}
