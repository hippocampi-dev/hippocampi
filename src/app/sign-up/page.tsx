'use client'

// sign in with google
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignUp() {
  return (
    <main>
      <button onClick={() => signIn("google", {
        callbackUrl: `${window.location.origin}/middle` // redirect to /dashboard after login
      })}>Sign up</button>
    </main>
  )
}