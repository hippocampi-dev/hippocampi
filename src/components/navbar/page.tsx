import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession(); // Get session data (user info)

  return (
    <header className="flex gap-4">
      {session ? (
        <>
          <p>Welcome, {session.user?.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
        <Link href={'/'}>Home</Link>
        <Link href={'/checkout/one-time'}>One-time payment</Link>
        <Link href={'/checkout/subscription'}>Subscription</Link>
        <Link href={'/account'}>Manage subscription</Link>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
        </>
      )}
    </header>
  );
}