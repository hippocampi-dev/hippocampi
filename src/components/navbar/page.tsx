import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession(); // Get session data (user info)

  return (
    <header className="flex gap-4">
      {session ? (
        <>
        <Link href={'/dashboard'}>Dashboard</Link>
        <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
        <Link href={'/'}>Hippocampi</Link>
        <Link href='/sign-up'>Sign up</Link>
        {/* <button onClick={() => signIn("google", {
          callbackUrl: `${window.location.origin}/dashboard` // redirect to /dashboard after login
        })}>Sign up</button> */}
        </>
      )}
    </header>
  );
}