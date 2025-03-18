"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useToast } from "~/hooks/useToaster"
import { NPIForm, NPIFormData } from "~/components/doctor-onboarding/NPIForm"
import { LicenseForm, LicenseFormData, MedicalLicenseForm } from "~/components/doctor-onboarding/MedicalLicenseForm"
import { DEAForm, DEAFormData } from "~/components/doctor-onboarding/DEAForm"
import { MalpracticeForm, MalpracticeFormData } from "~/components/doctor-onboarding/MalpracticeForm"
import { CertificationsForm, CertificationsFormData } from "~/components/doctor-onboarding/CertificationsForm"
import { CredentialConfirmation } from "~/components/doctor-onboarding/CredentialConfirmation"

export interface CredentialsInterface {
  npi: NPIForm,
  license: LicenseForm,
  dea: DEAForm,
  malpractice: MalpracticeForm,
  certifications: CertificationsForm
}

export default function CredentialsSubmission() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("npi")
  const [progress, setProgress] = useState(0)
  // Update the completedSections state to include a confirmation section
  const [completedSections, setCompletedSections] = useState({
    npi: false,
    license: false,
    dea: false,
    malpractice: false,
    certifications: false,
    confirmation: false,
  })

  // Add a state for confirmation checkbox
  const [confirmationChecked, setConfirmationChecked] = useState(false)

  // State to store form data for each tab
  const [npiData, setNpiData] = useState<NPIFormData>({ npiNumber: "", file: null })
  const [licenseData, setLicenseData] = useState<LicenseFormData>({ licenseNumber: "", expirationDate: "", file: null })
  const [deaData, setDeaData] = useState<DEAFormData>({ deaNumber: "", startDate: "", expirationDate: "", file: null })
  const [malpracticeData, setMalpracticeData] = useState<MalpracticeFormData>({
    policyNumber: "",
    insurerName: "",
    startDate: "",
    expirationDate: "",
    coverageAmount: "",
    file: null
  })
  const [certificationsData, setCertificationsData] = useState<CertificationsFormData>({
    certifications: [
      {
        id: "cert-" + Date.now(),
        organization: "",
        name: "",
        dateReceived: "",
        expirationDate: "",
        file: null,
        fileUploaded: false,
      },
    ],
  })

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  }

  // Handle section completion
  const handleSectionComplete = (section: keyof typeof completedSections) => {
    const updatedSections = { ...completedSections, [section]: true }
    setCompletedSections(updatedSections)

    // Calculate progress
    const totalSections = Object.keys(completedSections).length
    const completedCount = Object.values(updatedSections).filter(Boolean).length
    const progressPercentage = ((completedCount - (updatedSections.confirmation ? 1 : 0)) / totalSections) * 100
    setProgress(progressPercentage)

    // Show success toast
    toast({
      title: "Section Completed",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} information saved successfully.`,
    })

    // Move to next tab if available
    const sections = Object.keys(completedSections)
    const currentIndex = sections.indexOf(section)

    if (section === "confirmation") {
      // All sections completed including confirmation
      toast({
        title: "All Credentials Submitted",
        description: "Thank you for completing the credential submission process.",
      })
    } else if (currentIndex < sections.length - 2) {
      // -2 to skip confirmation until all others are done
      setActiveTab(sections[currentIndex + 1]!)
    }
  }

  // Update handlers for each form
  const updateNpiData = (data: Partial<NPIFormData>) => {
    // Only update if there's actual data to update
    if (Object.keys(data).length > 0) {
      setNpiData((prev) => ({ ...prev, ...data }))
    }
    console.log(data)
  }

  const updateLicenseData = (data: Partial<LicenseFormData>) => {
    if (Object.keys(data).length > 0) {
      setLicenseData((prev) => ({ ...prev, ...data }))
    }
  }

  const updateDeaData = (data: Partial<DEAFormData>) => {
    if (Object.keys(data).length > 0) {
      setDeaData((prev) => ({ ...prev, ...data }))
    }
  }

  const updateMalpracticeData = (data: Partial<MalpracticeFormData>) => {
    if (Object.keys(data).length > 0) {
      setMalpracticeData((prev) => ({ ...prev, ...data }))
    }
  }

  const updateCertificationsData = (data: Partial<CertificationsFormData>) => {
    if (Object.keys(data).length > 0) {
      setCertificationsData((prev) => ({ ...prev, ...data }))
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Credential Submission</h1>
          <p className="text-muted-foreground">
            Please complete all sections to submit your credentials for verification.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submission Progress</CardTitle>
            <CardDescription>
              {progress === 100
                ? "All sections completed! You can still edit any section if needed."
                : `${Math.round(progress)}% complete - please fill out all required sections.`}
            </CardDescription>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="npi" className="relative">
                  NPI
                  {completedSections.npi && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="license" className="relative">
                  License
                  {completedSections.license && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="dea" className="relative">
                  DEA
                  {completedSections.dea && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="malpractice" className="relative">
                  Malpractice
                  {completedSections.malpractice && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="certifications" className="relative">
                  Certifications
                  {completedSections.certifications && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500" />
                  )}
                </TabsTrigger><TabsTrigger
                  value="confirmation"
                  className="relative"
                  disabled={
                    !(Object.entries(completedSections).filter(
                      ([key, value]) => key !== "confirmation" && value === true,
                    ).length === 5)
                  }
                >
                  Submit
                  {completedSections.confirmation && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500" />
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="npi">
                <NPIForm
                  initialData={npiData}
                  onUpdate={updateNpiData}
                  onComplete={() => handleSectionComplete("npi")}
                  isCompleted={completedSections.npi}
                />
              </TabsContent>

              <TabsContent value="license">
                <MedicalLicenseForm
                  initialData={licenseData}
                  onUpdate={updateLicenseData}
                  onComplete={() => handleSectionComplete("license")}
                  isCompleted={completedSections.license}
                />
              </TabsContent>

              <TabsContent value="dea">
                <DEAForm
                  initialData={deaData}
                  onUpdate={updateDeaData}
                  onComplete={() => handleSectionComplete("dea")}
                  isCompleted={completedSections.dea}
                />
              </TabsContent>

              <TabsContent value="malpractice">
                <MalpracticeForm
                  initialData={malpracticeData}
                  onUpdate={updateMalpracticeData}
                  onComplete={() => handleSectionComplete("malpractice")}
                  isCompleted={completedSections.malpractice}
                />
              </TabsContent>

              <TabsContent value="certifications">
                <CertificationsForm
                  initialData={certificationsData}
                  onUpdate={updateCertificationsData}
                  onComplete={() => handleSectionComplete("certifications")}
                  isCompleted={completedSections.certifications}
                />
              </TabsContent>

              <TabsContent value="confirmation">
                <CredentialConfirmation
                  npiData={npiData}
                  licenseData={licenseData}
                  deaData={deaData}
                  malpracticeData={malpracticeData}
                  certificationsData={certificationsData}
                  onConfirmationChange={setConfirmationChecked}
                  onComplete={() => handleSectionComplete("confirmation")}
                  isCompleted={completedSections.confirmation}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                const sections = Object.keys(completedSections)
                const currentIndex = sections.indexOf(activeTab)
                if (currentIndex > 0) {
                  setActiveTab(sections[currentIndex - 1]!)
                }
              }}
              disabled={activeTab === "npi"}
            >
              Previous
            </Button>
            {/* Update the Next button to navigate to confirmation when all sections are complete */}
            <Button
              onClick={() => {
                const sections = Object.keys(completedSections)
                const currentIndex = sections.indexOf(activeTab)
                if (currentIndex < sections.length - 1) {
                  // If all credential sections are complete, go to confirmation
                  if (
                    activeTab === "certifications" &&
                    completedSections.npi &&
                    completedSections.license &&
                    completedSections.dea &&
                    completedSections.malpractice &&
                    completedSections.certifications
                  ) {
                    setActiveTab("confirmation")
                  } else if (currentIndex < sections.length - 2) {
                    // Don't automatically go to confirmation
                    setActiveTab(sections[currentIndex + 1]!)
                  }
                }
              }}
              disabled={activeTab === "confirmation"}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}