'use client'

import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { string } from "zod";
import Loading from "~/components/loading/page";

export default function SignOut({
  children
}: {
  children: React.ReactNode,
}) {
  return (<button className={`w-full text-left`} onClick={async () => {await signOut(); redirect("/")}}> {children} </button>)
}