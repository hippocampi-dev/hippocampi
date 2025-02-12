'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "~/components/loading/page";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [])

  return (
    <Loading />
  )
}