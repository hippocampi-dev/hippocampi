"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"
import { CheckCircle, AlertCircle, FileText, Calendar, User, Shield } from "lucide-react"
import { CredentialsInterface } from "~/app/(dashboard)/onboarding/credentials/page"
import { MalpracticeFormData } from "./MalpracticeForm"
import { DEAFormData } from "./DEAForm"
import { LicenseFormData } from "./MedicalLicenseForm"
import { NPIFormData } from "./NPIForm"
import { Certification, CertificationsFormData } from "./CertificationsForm"
import { useSession } from "next-auth/react"
import { addDoctorCredentialLinksOnboarding } from "~/app/_actions/onboarding/actions"
import { useRouter } from "next/navigation"

interface CredentialConfirmationProps {
  npiData: NPIFormData
  licenseData: LicenseFormData
  deaData: DEAFormData
  malpracticeData: MalpracticeFormData
  certificationsData: CertificationsFormData
  onConfirmationChange: (checked: boolean) => void
  onComplete: () => void
  isCompleted?: boolean
}

export function CredentialConfirmation({
  npiData,
  licenseData,
  deaData,
  malpracticeData,
  certificationsData,
  onConfirmationChange,
  onComplete,
  isCompleted = false,
}: CredentialConfirmationProps) {
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const {data: session} = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!confirmChecked) {
      return
    }

    setLoading(true);

    const credentials: CredentialsInterface = {
      npi: {
        npiNumber: npiData.npiNumber,
        file: npiData.file!
      },
      license: {
        licenseNumber: licenseData.licenseNumber,
        expirationDate: licenseData.expirationDate,
        file: licenseData.file!
      },
      dea: {
        deaNumber: deaData.deaNumber,
        startDate: deaData.startDate,
        expirationDate: deaData.expirationDate,
        file: deaData.file!
      },
      malpractice: {
        policyNumber: malpracticeData.policyNumber,
        insurerName: malpracticeData.insurerName,
        startDate: malpracticeData.startDate,
        expirationDate: malpracticeData.expirationDate,
        coverageAmount: malpracticeData.coverageAmount,
        file: malpracticeData.file!
      },
      certifications: {
        certifications: certificationsData.certifications.map<Certification>((cert) => ({
          id: cert.id,
          organization: cert.organization,
          name: cert.name,
          dateReceived: cert.dateReceived,
          expirationDate: cert.expirationDate,
          file: cert.file!
        }))
      },
    }
    await addDoctorCredentialLinksOnboarding(session?.user.id!, credentials).then(() =>{
      setLoading(false)
      onComplete()
      setTimeout(() => {
        router.push("/onboarding/complete")
      }, 5 * 1000)
    });
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Credential Submission Confirmation</h3>
        {isCompleted && (
          <div className="flex items-center text-green-500 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Submitted</span>
          </div>
        )}
      </div>

      <div className="rounded-md bg-amber-50 border border-amber-200 p-4 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
        <div>
          <h4 className="font-medium text-amber-800">Important Notice</h4>
          <p className="text-sm text-amber-700 mt-1">
            Please review all your credential information carefully before submission. Once submitted, your credentials
            will be verified by our team, and you may be contacted if additional information is needed.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Credential Summary</h4>

        <Card className="p-4 bg-slate-50">
          <div className="flex items-center space-x-2 mb-2">
            <User className="h-5 w-5 text-primary" />
            <h5 className="font-medium">NPI Information</h5>
          </div>
          <div className="pl-7 space-y-1 text-sm">
            <p>
              <span className="font-medium">NPI Number:</span> {npiData.npiNumber}
            </p>
            <p>
              <span className="font-medium">Verification Document:</span>{" "}
              {npiData.fileUploaded ? "Uploaded" : "Not uploaded"}
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-slate-50">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h5 className="font-medium">Medical License</h5>
          </div>
          <div className="pl-7 space-y-1 text-sm">
            <p>
              <span className="font-medium">License Number:</span> {licenseData.licenseNumber}
            </p>
            <p>
              <span className="font-medium">Expiration Date:</span> {formatDate(licenseData.expirationDate)}
            </p>
            <p>
              <span className="font-medium">License Document:</span>{" "}
              {licenseData.fileUploaded ? "Uploaded" : "Not uploaded"}
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-slate-50">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h5 className="font-medium">DEA Registration</h5>
          </div>
          <div className="pl-7 space-y-1 text-sm">
            <p>
              <span className="font-medium">DEA Number:</span> {deaData.deaNumber}
            </p>
            <p>
              <span className="font-medium">Valid From:</span> {formatDate(deaData.startDate)} to{" "}
              {formatDate(deaData.expirationDate)}
            </p>
            <p>
              <span className="font-medium">DEA Certificate:</span> {deaData.fileUploaded ? "Uploaded" : "Not uploaded"}
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-slate-50">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h5 className="font-medium">Malpractice Insurance</h5>
          </div>
          <div className="pl-7 space-y-1 text-sm">
            <p>
              <span className="font-medium">Policy Number:</span> {malpracticeData.policyNumber}
            </p>
            <p>
              <span className="font-medium">Insurance Provider:</span> {malpracticeData.insurerName}
            </p>
            <p>
              <span className="font-medium">Coverage Amount:</span> {malpracticeData.coverageAmount}
            </p>
            <p>
              <span className="font-medium">Valid From:</span> {formatDate(malpracticeData.startDate)} to{" "}
              {formatDate(malpracticeData.expirationDate)}
            </p>
            <p>
              <span className="font-medium">Insurance Certificate:</span>{" "}
              {malpracticeData.fileUploaded ? "Uploaded" : "Not uploaded"}
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-slate-50">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h5 className="font-medium">Board Certifications ({certificationsData.certifications.length})</h5>
          </div>
          <div className="pl-7 space-y-3 text-sm">
            {certificationsData.certifications.map((cert, index) => (
              <div key={cert.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                <p className="font-medium">
                  Certification {index + 1}: {cert.name}
                </p>
                <p>
                  <span className="font-medium">Organization:</span> {cert.organization}
                </p>
                <p>
                  <span className="font-medium">Date Received:</span> {formatDate(cert.dateReceived)}
                </p>
                {cert.expirationDate && (
                  <p>
                    <span className="font-medium">Expiration Date:</span> {formatDate(cert.expirationDate)}
                  </p>
                )}
                <p>
                  <span className="font-medium">Certificate:</span> {cert.fileUploaded ? "Uploaded" : "Not uploaded"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="rounded-md border p-4 space-y-4">
        <h4 className="font-medium">Attestation</h4>
        <p className="text-sm text-muted-foreground">By checking the box below, I certify that:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>All information provided is accurate, complete, and current to the best of my knowledge</li>
          <li>I understand that providing false information may result in rejection of my application</li>
          <li>I authorize verification of all information provided in this application</li>
          <li>I will promptly notify the organization of any changes to the information provided</li>
          <li>I understand that additional information may be requested during the verification process</li>
        </ul>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="confirmation"
            checked={confirmChecked}
            onCheckedChange={(checked) => {
              const isChecked = checked === true
              setConfirmChecked(isChecked)
              onConfirmationChange(isChecked)
            }}
            disabled={isCompleted}
          />
          <Label
            htmlFor="confirmation"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm that all information provided is accurate and complete
          </Label>
        </div>
      </div>

      {!isCompleted && (
        <Button type="submit" disabled={!confirmChecked || loading} className="w-full">
          {loading ? "Submitting Credentials..." : "Submit All Credentials"}
        </Button>
      )}

      {isCompleted && (
        <div className="rounded-md bg-green-50 border border-green-200 p-4 flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800">Credentials Successfully Submitted</h4>
            <p className="text-sm text-green-700 mt-1">
              Your credentials have been submitted for verification. You will be notified once the verification process
              is complete. You will be redirected to the completed page in 5 seconds.
            </p>
          </div>
        </div>
      )}
    </form>
  )
}