"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

export function MFASetup() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [token, setToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const setupMFA = async () => {
    try {
      const response = await fetch("/api/auth/setup-mfa")
      const data = await response.json()
      if (data.qrCode && data.secret) {
        setQrCode(data.qrCode)
        setSecret(data.secret)
      }
    } catch (error) {
      setError("Failed to set up MFA")
    }
  }

  const verifyMFA = async () => {
    try {
      const response = await fetch("/api/auth/verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await response.json()
      if (data.success) {
        setSuccess(true)
      } else {
        setError("Invalid token")
      }
    } catch (error) {
      setError("Failed to verify MFA")
    }
  }

  if (success) {
    return <div>MFA has been successfully set up!</div>
  }

  return (
    <div className="space-y-4">
      {!qrCode && <Button onClick={setupMFA}>Set up MFA</Button>}
      {qrCode && (
        <>
          <div>Scan this QR code with your authenticator app:</div>
          <Image src={qrCode || "/placeholder.svg"} alt="MFA QR Code" width={200} height={200} />
          {secret && (
            <div>
              <div>Or enter this secret manually:</div>
              <code>{secret}</code>
            </div>
          )}
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter the 6-digit code"
          />
          <Button onClick={verifyMFA}>Verify and Enable MFA</Button>
        </>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}