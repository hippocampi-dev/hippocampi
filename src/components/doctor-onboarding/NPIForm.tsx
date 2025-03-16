"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { HelpCircle, CheckCircle, Edit } from "lucide-react"
import { FileUploader } from "./FileUploader"

export interface NPIFormData {
  npiNumber: string
  file: File | null
  fileUploaded?: boolean
}

export interface NPIForm {
  npiNumber: string
  file: File
}

interface NPIFormProps {
  initialData?: NPIFormData
  onUpdate: (data: Partial<NPIFormData>) => void
  onComplete: () => void
  isCompleted?: boolean
}

export function NPIForm({ initialData = { npiNumber: "", file: null }, onUpdate, onComplete, isCompleted = false }: NPIFormProps) {
  const [npiNumber, setNpiNumber] = useState(initialData.npiNumber || "")
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(initialData.fileUploaded || false)
  const [file, setFile] = useState<File | null>(initialData.file || null);

  const validateNPI = (npi: string) => {
    // NPI is a 10-digit number
    if (!/^\d{10}$/.test(npi)) {
      setIsValid(false)
      setErrorMessage("NPI must be exactly 10 digits")
      return false
    }

    setIsValid(true)
    setErrorMessage("")
    return true
  }

  // Modify the handleSubmit function to update the parent before completing
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateNPI(npiNumber)) {
      return
    }

    setLoading(true)

    // Update parent with current values before completing
    onUpdate({ npiNumber, fileUploaded, file })

    // Simulate API call to validate NPI
    setTimeout(() => {
      setLoading(false)
      onComplete()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">NPI Information</h3>
        {isCompleted && (
          <div className="flex items-center text-green-500 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Completed</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="npi-number">National Provider Identifier (NPI)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  The NPI is a unique 10-digit identification number issued to healthcare providers in the United States
                  by the Centers for Medicare and Medicaid Services (CMS).
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="npi-number"
          placeholder="Enter your 10-digit NPI number"
          value={npiNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10)
            setNpiNumber(value)
            if (value.length === 10) {
              validateNPI(value)
            }
          }}
          onBlur={() => {
            if (npiNumber) {
              onUpdate({ npiNumber })
            }
          }}
          className={!isValid ? "border-red-500" : ""}
        />
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        <p className="text-xs text-muted-foreground">
          Your NPI must be exactly 10 digits. This will be used to verify your identity and credentials.
        </p>
      </div>

      {/* Simulated file upload for NPI verification document */}
      <div className="space-y-2">
        <Label htmlFor="npi-verification">NPI Verification Document</Label>
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
          Please upload a document verifying your NPI. Accepted formats: PDF, JPG, PNG. Maximum file size: 5MB.
        </p>
      </div>

      <div className="rounded-md bg-muted p-4">
        <h3 className="font-medium mb-2">Why we need your NPI</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>To verify your identity as a healthcare provider</li>
          <li>To check your credentials against national databases</li>
          <li>To ensure compliance with healthcare regulations</li>
          <li>To streamline the credentialing process</li>
        </ul>
      </div>

      <Button type="submit" disabled={!npiNumber || !isValid || !fileUploaded || loading} className="w-full">
        {loading ? "Validating..." : "Save and Continue"}
      </Button>
    </form>
  )
}