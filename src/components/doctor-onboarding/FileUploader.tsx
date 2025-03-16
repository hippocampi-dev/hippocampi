"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Upload, Check, AlertCircle } from "lucide-react"

interface FileUploaderProps {
  acceptedFileTypes: string[]
  maxFileSizeMB: number
  onUploadComplete: (success: boolean, file: File | null) => void
  initialFileUploaded?: boolean
  currentFile?: File | null
}

export function FileUploader({
  acceptedFileTypes,
  maxFileSizeMB,
  onUploadComplete,
  initialFileUploaded = false,
  currentFile
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(currentFile || null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(initialFileUploaded)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set initial state based on props
  useEffect(() => {
    setUploadSuccess(initialFileUploaded)
  }, [initialFileUploaded])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)

    if (!selectedFile) {
      return
    }

    // Check file type
    const fileExtension = "." + selectedFile.name.split(".").pop()?.toLowerCase()
    if (!acceptedFileTypes.includes(fileExtension)) {
      setError(`Invalid file type. Accepted types: ${acceptedFileTypes.join(", ")}`)
      return
    }

    // Check file size
    if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size: ${maxFileSizeMB}MB`)
      return
    }

    setFile(selectedFile)
    handleUpload(selectedFile)
  }

  const handleUpload = (fileToUpload: File | null) => {
    setUploading(true)
    setUploadSuccess(false)

    // Simulate file upload
    setTimeout(() => {
      setUploading(false)
      setUploadSuccess(true)
      onUploadComplete(true, fileToUpload)
    }, 1500)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes.join(",")}
        className="hidden"
      />

      <div
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointertransition-colors
          ${error ? "border-red-500" : uploadSuccess ? "border-green-500 bg-muted/50" : "border-muted"}`}
        onClick={triggerFileInput}
      >
        {uploadSuccess ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium">File uploaded successfully</p>
            <p className="text-xs text-muted-foreground">{file?.name}</p>
            {(
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                  setUploadSuccess(false)
                  onUploadComplete(false, null)
                }}
              >
                Replace File
              </Button>
            )}
          </div>
        ) : uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm font-medium">Uploading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-sm font-medium text-red-500">{error}</p>
            <p className="text-xs text-muted-foreground">Click to try again</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Click to upload file</p>
            <p className="text-xs text-muted-foreground">
              {acceptedFileTypes.join(", ")} (Max {maxFileSizeMB}MB)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}