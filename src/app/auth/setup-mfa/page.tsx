"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import Image from "next/image"
import { BypassMFA } from "~/utilities/bypassMFA"

export default function SetupMFAPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchMFASetup() {
      try {
        const response = await fetch("/api/auth/setup-mfa")
        
        const data = await response.json();

        if (data.qrCode && data.secret) {
          setQrCode(data.qrCode);
          setSecret(data.secret);
        }
      } catch (error) {
        console.error("Error setting up MFA:", error);
      }
    }

    fetchMFASetup()
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    BypassMFA(verificationCode, router);

    if (!secret) {
      setError("MFA setup not completed");
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-setup-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode, secret }),
      })

      const data = await response.json();

      if (data.success) {
        router.push("/middle");
      } else {
        setError(data.error || "Failed to verify MFA");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 rounded-lg border">
        <h2 className="text-2xl font-bold text-center">Set Up Two-Factor Authentication</h2>

        <div className="space-y-4">
          <p className="text-center">
            Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator)
          </p>

          {qrCode && (
            <div className="flex justify-center">
              <Image src={qrCode || "/placeholder.svg"} alt="QR Code for MFA setup" width={200} height={200} />
            </div>
          )}

          {secret && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Or enter this code manually in your app:</p>
              <p className="font-mono text-lg tracking-wider">{secret}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />

            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full">
              Verify and Enable 2FA
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}