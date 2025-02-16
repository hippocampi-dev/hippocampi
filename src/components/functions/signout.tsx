'use client'

import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "~/components/loading/page";

export default function SignOut() {
  return (<button onClick={() => {signOut(); redirect("/")}}> Sign Out </button>)
}