"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading authentication error...</div>}>
      <AuthErrorMessage />
    </Suspense>
  )
}

function AuthErrorMessage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Authentication Error</h2>
          <p className="mt-2 text-center text-sm text-gray-600">{error || "An error occurred during authentication"}</p>
        </div>
        <div className="mt-6">
          <Link href="/auth/login">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}