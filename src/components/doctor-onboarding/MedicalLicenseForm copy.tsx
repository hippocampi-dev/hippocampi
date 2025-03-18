"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { FileUploader } from "./FileUploader"

interface MedicalLicenseFormProps {
  onComplete: () => void
}

export function MedicalLicenseForm({ onComplete }: MedicalLicenseFormProps) {
  const [licenseNumber, setLicenseNumber] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [fileUploaded, setFileUploaded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (success: boolean) => {
    setFileUploaded(success)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!licenseNumber || !expirationDate || !fileUploaded) {
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onComplete()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="license-number">California Medical License Number</Label>
        <Input
          id="license-number"
          placeholder="Enter your license number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiration-date">License Expiration Date</Label>
        <Input
          id="expiration-date"
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Upload California Medical License</Label>
        <FileUploader
          acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
          maxFileSizeMB={5}
          onUploadComplete={handleFileUpload}
        />
        <p className="text-xs text-muted-foreground">
          Please upload a clear, current copy of your California Medical License. Accepted formats: PDF, JPG, PNG.
          Maximum file size: 5MB.
        </p>
      </div>

      <div className="rounded-md bg-muted p-4">
        <h3 className="font-medium mb-2">License Requirements</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Must be a current, valid California Medical License</li>
          <li>License must not be expired or under any restrictions</li>
          <li>Document must be clearly legible</li>
          <li>All information must match your application details</li>
        </ul>
      </div>

      <Button type="submit" disabled={!licenseNumber || !expirationDate || !fileUploaded || loading} className="w-full">
        {loading ? "Saving..." : "Save and Continue"}
      </Button>
    </form>
  )
}