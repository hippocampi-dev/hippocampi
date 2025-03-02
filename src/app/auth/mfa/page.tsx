"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

export default function MFAVerification() {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/auth/verify-mfa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json();

      if (data.success) {
        router.push("/middle"); // or wherever you want to redirect after successful MFA
      } else {
        setError(data.error || "Invalid code")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Enter MFA Code</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the 6-digit code from your authenticator app
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              id="token"
              name="token"
              type="text"
              required
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <Button type="submit" className="w-full">
              Verify
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}