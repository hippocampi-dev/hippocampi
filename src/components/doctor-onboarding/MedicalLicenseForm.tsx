"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { CheckCircle, Edit } from "lucide-react"
import { FileUploader } from "./FileUploader"

export interface LicenseFormData {
  licenseNumber: string
  expirationDate: string
  file: File | null
  fileUploaded?: boolean
}

export interface LicenseForm {
  licenseNumber: string,
  expirationDate: string,
  file: File | string | null,
  fileUrl?: string
}

interface MedicalLicenseFormProps {
  initialData?: LicenseFormData
  onUpdate: (data: Partial<LicenseFormData>) => void
  onComplete: () => void
  isCompleted?: boolean
}

export function MedicalLicenseForm({
  initialData = { licenseNumber: "", expirationDate: "", file: null },
  onUpdate,
  onComplete,
  isCompleted = false,
}: MedicalLicenseFormProps) {
  const [licenseNumber, setLicenseNumber] = useState(initialData.licenseNumber || "")
  const [expirationDate, setExpirationDate] = useState(initialData.expirationDate || "")
  const [fileUploaded, setFileUploaded] = useState(initialData.fileUploaded || false)
  const [file, setFile] = useState<File | null>(initialData.file || null);
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!licenseNumber || !expirationDate || !fileUploaded) {
      return
    }

    setLoading(true)

    // Update parent with current values before completing
    onUpdate({ licenseNumber, expirationDate, fileUploaded, file })

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onComplete()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">California Medical License</h3>
        {isCompleted && (
          <div className="flex items-center text-green-500 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Completed</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="license-number">California Medical License Number</Label>
        <Input
          id="license-number"
          placeholder="Enter your license number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          onBlur={() => licenseNumber && onUpdate({ licenseNumber })}
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
          onBlur={() => expirationDate && onUpdate({ expirationDate })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Upload California Medical License</Label>
        <FileUploader
          acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
          maxFileSizeMB={5}
          onUploadComplete={(success, file) => {
            setFileUploaded(success)
            setFile(file)
            onUpdate({ fileUploaded: success, file})
          }}
          initialFileUploaded={fileUploaded}
          currentFile={file}
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
        {loading ? "Validating..." : "Save and Continue"}
      </Button>
    </form>
  )
}