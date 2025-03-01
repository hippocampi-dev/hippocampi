'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AutoSignoutProvider } from "~/components/context/AutoSignoutProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-up")
    }
  }, [status, router]);

  return (
    // <AutoSignoutProvider>
    <>
      {children}
    </>
    // </AutoSignoutProvider>
  )
}