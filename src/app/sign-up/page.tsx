"use client";

// direct to /patient or /doctor
import { signIn } from "next-auth/webauthn";

export default function SignUp() {
  return (
    <main>
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: `${window.location.origin}/dashboard`, // redirect to /dashboard after login
          })
        }
      >
        Sign up
      </button>
    </main>
  );
}
