"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Plus, Trash2, CheckCircle } from "lucide-react"
import { FileUploader } from "./FileUploader"

export interface CertificationData {
  id: string
  organization: string
  name: string
  dateReceived: string
  expirationDate?: string
  file: File | null
  fileUploaded?: boolean
}

export interface Certification {
  id: string
  organization: string
  name: string
  dateReceived: string
  expirationDate?: string
  file: File | string
  fileUrl?: string
}

export interface CertificationsFormData {
  certifications: CertificationData[]
}

export interface CertificationsForm {
  certifications: Certification[]
}

interface CertificationsFormProps {
  initialData?: CertificationsFormData
  onUpdate: (data: Partial<CertificationsFormData>) => void
  onComplete: () => void
  isCompleted?: boolean
}

export function CertificationsForm({
  initialData = {
    certifications: [
      {
        id: "cert-" + Date.now(),
        organization: "",
        name: "",
        dateReceived: "",
        expirationDate: "",
        fileUploaded: false,
        file: null
      },
    ],
  },
  onUpdate,
  onComplete,
  isCompleted = false,
}: CertificationsFormProps) {
  const [certifications, setCertifications] = useState<CertificationData[]>(
    initialData.certifications || [
      {
        id: "cert-" + Date.now(),
        organization: "",
        name: "",
        dateReceived: "",
        expirationDate: "",
        fileUploaded: false,
        file: null
      },
    ],
  )
  const [loading, setLoading] = useState(false)
  const [certId, setCertId] = useState(certifications[0]?.id)

  const handleCertificationChange = (id: string, field: keyof Omit<Certification, "id">, value: string) => {
    setCertifications((prev) => prev.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)))
  }

  // Update the addCertification and removeCertification functions to update the parent after modifying certifications
  const addCertification = () => {
    const newCertifications = [
      ...certifications,
      {
        id: "cert-" + Date.now(),
        organization: "",
        name: "",
        dateReceived: "",
        expirationDate: "",
        fileUploaded: false,
        file: null
      },
    ]
    setCertifications(newCertifications)
    onUpdate({ certifications: newCertifications })
  }

  const removeCertification = (id: string) => {
    if (certifications.length > 1) {
      const newCertifications = certifications.filter((cert) => cert.id !== id)
      setCertifications(newCertifications)
      onUpdate({ certifications: newCertifications })
    }
  }

  const isFormValid = () => {
    return certifications.every((cert) => cert.organization && cert.name && cert.dateReceived && cert.fileUploaded)
  }

  // Modify the handleSubmit function to update the parent before completing
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      return
    }

    setLoading(true)

    // Update parent with current values before completing
    onUpdate({ certifications })

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onComplete()
    }, 1500)
  }

  // Update the handleCertificationChange function to update the parent when a field loses focus
  // Add a new function:
  const handleCertificationBlur = (id: string) => {
    // Only update the parent if this certification has some data
    const cert = certifications.find((c) => c.id === id)
    if (cert && (cert.organization || cert.name || cert.dateReceived)) {
      onUpdate({ certifications })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Board Certifications & Additional Credentials</h3>
        {isCompleted && (
          <div className="flex items-center text-green-500 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Completed</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={'certifications'}>Certifications</Label>
          <Button
            id="certifications"
            type="button"
            variant="outline"
            size="sm"
            onClick={addCertification}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Please add all relevant board certifications and additional credentials.
        </p>
      </div>

      {certifications.map((cert, index) => (
        <div key={cert.id} className="rounded-md border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Certification {index + 1}</h3>
            {certifications.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`org-${cert.id}`}>Certifying Organization</Label>
            <Select
              value={cert.organization}
              onValueChange={(value) => {
                handleCertificationChange(cert.id, "organization", value)
                handleCertificationBlur(cert.id)
              }}
            >
              <SelectTrigger id={`org-${cert.id}`}>
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abim">American Board of Internal Medicine (ABIM)</SelectItem>
                <SelectItem value="abfm">American Board of Family Medicine (ABFM)</SelectItem>
                <SelectItem value="abpn">American Board of Psychiatry and Neurology (ABPN)</SelectItem>
                <SelectItem value="abp">American Board of Pediatrics (ABP)</SelectItem>
                <SelectItem value="abog">American Board of Obstetrics and Gynecology (ABOG)</SelectItem>
                <SelectItem value="abs">American Board of Surgery (ABS)</SelectItem>
                <SelectItem value="other">Other (please specify)</SelectItem>
              </SelectContent>
            </Select>

            {cert.organization === "other" && (
              <Input
                placeholder="Enter organization name"
                value={cert.organization === "other" ? "" : cert.organization}
                onChange={(e) => handleCertificationChange(cert.id, "organization", e.target.value)}
                onBlur={() => handleCertificationBlur(cert.id)}
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`name-${cert.id}`}>Certification Name</Label>
            <Input
              id={`name-${cert.id}`}
              placeholder="Enter certification name"
              value={cert.name}
              onChange={(e) => handleCertificationChange(cert.id, "name", e.target.value)}
              onBlur={() => handleCertificationBlur(cert.id)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`received-${cert.id}`}>Date Received</Label>
              <Input
                id={`received-${cert.id}`}
                type="date"
                value={cert.dateReceived}
                onChange={(e) => handleCertificationChange(cert.id, "dateReceived", e.target.value)}
                onBlur={() => handleCertificationBlur(cert.id)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`expiration-${cert.id}`}>Expiration Date (if applicable)</Label>
              <Input
                id={`expiration-${cert.id}`}
                type="date"
                value={cert.expirationDate}
                onChange={(e) => handleCertificationChange(cert.id, "expirationDate", e.target.value)}
                onBlur={() => handleCertificationBlur(cert.id)}
              />
            </div>
          </div>

          <div className="space-y-2" onClick={() => {
            setCertId(cert.id)
            handleCertificationBlur(cert.id)
          }}>
            <Label>Upload Board Certification</Label>
            <FileUploader
              acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
              maxFileSizeMB={5}
              onUploadComplete={(success, file) => {
                setCertifications((prev) => prev.map((cert) => (cert.id === certId ? { ...cert, fileUploaded: success, file } : cert)))
              }}
              initialFileUploaded={cert.fileUploaded}
              currentFile={cert.file}
            />
            <p className="text-xs text-muted-foreground">
              Please upload a clear, current copy of your Board Certification. Accepted formats: PDF, JPG, PNG.
              Maximum file size: 5MB.
            </p>
          </div>
        </div>
      ))}

      <div className="rounded-md bg-muted p-4">
        <h3 className="font-medium mb-2">Certification Guidelines</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>All certifications must be current and valid</li>
          <li>Documents must clearly show your name, the certifying organization, and dates</li>
          <li>Include any specialized training certificates relevant to your practice</li>
          <li>If a certification does not expire, you may leave the expiration date blank</li>
        </ul>
      </div>

      <Button type="submit" disabled={!isFormValid() || loading} className="w-full">
        {loading ? "Validating..." : "Save and Continue"}
      </Button>
    </form>
  )
}