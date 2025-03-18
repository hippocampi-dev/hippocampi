"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { CheckCircle, Edit } from "lucide-react"
import { FileUploader } from "./FileUploader"

export interface DEAFormData {
  deaNumber: string
  startDate: string
  expirationDate: string
  file: File | null
  fileUploaded?: boolean
}

export interface DEAForm {
  deaNumber: string
  startDate: string
  expirationDate: string
  file: File | string
}

interface DEAFormProps {
  initialData?: DEAFormData
  onUpdate: (data: Partial<DEAFormData>) => void
  onComplete: () => void
  isCompleted?: boolean
}

export function DEAForm({
  initialData = { deaNumber: "", startDate: "", expirationDate: "", file: null },
  onUpdate,
  onComplete,
  isCompleted = false,
}: DEAFormProps) {
  const [deaNumber, setDeaNumber] = useState(initialData.deaNumber || "")
  const [startDate, setStartDate] = useState(initialData.startDate || "")
  const [expirationDate, setExpirationDate] = useState(initialData.expirationDate || "")
  const [fileUploaded, setFileUploaded] = useState(initialData.fileUploaded || false)
  const [file, setFile] = useState<File | null>(initialData.file || null);
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!deaNumber || !startDate || !expirationDate || !fileUploaded) {
      return
    }

    setLoading(true)

    // Update parent with current values before completing
    onUpdate({ deaNumber, startDate, expirationDate, fileUploaded, file })

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onComplete()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">DEA Registration</h3>
        {isCompleted && (
          <div className="flex items-center text-green-500 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Completed</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dea-number">DEA Registration Number</Label>
        <Input
          id="dea-number"
          placeholder="Enter your DEA number"
          value={deaNumber}
          onChange={(e) => setDeaNumber(e.target.value)}
          onBlur={() => deaNumber && onUpdate({ deaNumber })}
          required
        />
        <p className="text-xs text-muted-foreground">
          DEA numbers typically begin with two letters followed by seven digits.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Registration Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onBlur={() => startDate && onUpdate({ startDate })}
            required
            readOnly={isCompleted}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiration-date">Registration Expiration Date</Label>
          <Input
            id="expiration-date"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            onBlur={() => expirationDate && onUpdate({ expirationDate })}
            required
            readOnly={isCompleted}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Upload DEA Registration</Label>
        <FileUploader
          acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
          maxFileSizeMB={5}
          onUploadComplete={(success, file) => {
            setFileUploaded(success)
            setFile(file)
            onUpdate({ fileUploaded: success, file })
          }}
          initialFileUploaded={fileUploaded}
          currentFile={file}
        />
        <p className="text-xs text-muted-foreground">
          Please upload a clear, current copy of your DEA Registration. Accepted formats: PDF, JPG, PNG.
          Maximum file size: 5MB.
        </p>
      </div>

      <div className="rounded-md bg-muted p-4">
        <h3 className="font-medium mb-2">DEA Certificate Requirements</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Must be a current, valid DEA certificate</li>
          <li>Certificate must not be expired</li>
          <li>Must show your full name, DEA number, and expiration date</li>
          <li>Document must be clearly legible</li>
        </ul>
      </div>

      <Button type="submit" disabled={!deaNumber || !startDate || !expirationDate || !fileUploaded || loading} className="w-full">
        {loading ? "Validating..." : "Save and Continue"}
      </Button>
    </form>
  )
}