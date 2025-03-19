"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { CheckCircle, Edit } from "lucide-react"
import { FileUploader } from "./FileUploader"

export interface MalpracticeFormData {
  policyNumber: string
  insurerName: string
  startDate: string
  expirationDate: string
  coverageAmount: string
  file: File | null
  fileUploaded?: boolean
}

export interface MalpracticeForm {
  policyNumber: string
  insurerName: string
  startDate: string
  expirationDate: string
  coverageAmount: string
  file: File | string
}

interface MalpracticeFormProps {
  initialData?: MalpracticeFormData
  onUpdate: (data: Partial<MalpracticeFormData>) => void
  onComplete: () => void
  isCompleted?: boolean
}

export function MalpracticeForm({
  initialData = { policyNumber: "", insurerName: "", startDate: "", expirationDate: "", coverageAmount: "", file: null },
  onUpdate,
  onComplete,
  isCompleted = false,
}: MalpracticeFormProps) {
  const [policyNumber, setPolicyNumber] = useState(initialData.policyNumber || "")
  const [insurerName, setInsurerName] = useState(initialData.insurerName || "")
  const [startDate, setStartDate] = useState(initialData.startDate || "")
  const [expirationDate, setExpirationDate] = useState(initialData.expirationDate || "")
  const [coverageAmount, setCoverageAmount] = useState(initialData.coverageAmount || "")
  const [fileUploaded, setFileUploaded] = useState(initialData.fileUploaded || false)
  const [file, setFile] = useState<File | null>(initialData.file || null);
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!policyNumber || !insurerName || !startDate || !expirationDate || !coverageAmount || !fileUploaded) {
      return
    }

    setLoading(true)

    // Update parent with current values before completing
    onUpdate({ policyNumber, insurerName, startDate, expirationDate, coverageAmount, fileUploaded, file })

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onComplete()
    }, 1500)
  }

  // Simulate file upload for this example
  const handleFileUpload = (success: boolean) => {
    setFileUploaded(success)
    onUpdate({ fileUploaded: success })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Malpractice Insurance</h3>
        {isCompleted && (
          <div className="flex items-center text-green-500 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Completed</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="policy-number">Malpractice Insurance Policy Number</Label>
        <Input
          id="policy-number"
          placeholder="Enter your policy number"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
          onBlur={() => policyNumber && onUpdate({ policyNumber })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="insurer-name">Insurance Provider Name</Label>
        <Input
          id="insurer-name"
          placeholder="Enter insurance company name"
          value={insurerName}
          onChange={(e) => setInsurerName(e.target.value)}
          onBlur={() => insurerName && onUpdate({ insurerName })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Policy Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onBlur={() => startDate && onUpdate({ startDate })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiration-date">Policy Expiration Date</Label>
          <Input
            id="expiration-date"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            onBlur={() => expirationDate && onUpdate({ expirationDate })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverage-amount">Coverage Amount</Label>
        <Input
          id="coverage-amount"
          placeholder="e.g., $1,000,000/$3,000,000"
          value={coverageAmount}
          onChange={(e) => setCoverageAmount(e.target.value)}
          onBlur={() => coverageAmount && onUpdate({ coverageAmount })}
          required
        />
        <p className="text-xs text-muted-foreground">Please enter the per occurrence/aggregate coverage limits.</p>
      </div>

      <div className="space-y-2">
        <Label>Upload Malpractice Insurance</Label>
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
          Please upload a clear, current copy of your Malpractice Insurance. Accepted formats: PDF, JPG, PNG.
          Maximum file size: 5MB.
        </p>
      </div>

      <div className="rounded-md bg-muted p-4">
        <h3 className="font-medium mb-2">Insurance Requirements</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Must have current professional liability insurance</li>
          <li>Minimum coverage of $1,000,000 per occurrence and $3,000,000 aggregate</li>
          <li>Policy must be active throughout your participation in our network</li>
          <li>Certificate must clearly show policy number, coverage dates, and limits</li>
        </ul>
      </div>

      <Button type="submit" 
          disabled={
            !policyNumber ||
            !insurerName ||
            !startDate ||
            !expirationDate ||
            !coverageAmount ||
            !fileUploaded ||
            loading
          }
          className="w-full">
        {loading ? "Validating..." : "Save and Continue"}
      </Button>
    </form>
  )
}