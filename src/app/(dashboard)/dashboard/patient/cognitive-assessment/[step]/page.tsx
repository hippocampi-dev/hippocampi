"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "~/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import ProgressBar from "~/components/patient-dashboard/cognitive-assessment-form/progressbar"
import WelcomeStep from "~/components/patient-dashboard/cognitive-assessment-form/steps/welcomestep"
import PrimaryConcernsStep from "~/components/patient-dashboard/cognitive-assessment-form/steps/primaryconcerns"
import AdditionalSupportStep from "~/components/patient-dashboard/cognitive-assessment-form/steps/additionalsupport"
import MentalDemandsStep from "~/components/patient-dashboard/cognitive-assessment-form/steps/mentaldemands"
import CognitiveChangesStep from "~/components/patient-dashboard/cognitive-assessment-form/steps/cognitivechanges"
import AreasForHelpStep from "~/components/patient-dashboard/cognitive-assessment-form/steps/areasforhelp"
import AdditionalInfoStep from "~/components/patient-dashboard/cognitive-assessment-form/steps/additionalinfo"
import ReviewStep from "~/components/patient-dashboard/cognitive-assessment-form/steps/reviewstep"

const steps = [
  "Welcome",
  "Primary Concerns",
  "Additional Support",
  "Mental Demands",
  "Cognitive Changes",
  "Areas for Help",
  "Additional Info",
  "Review",
]

export default function AssessmentStep({ params }: { params: Promise<{ step: string }> }) {
  const router = useRouter()
  const { step } = use(params);
  const currentStep = Number.parseInt(step) - 1
  type FormData = {
    primaryConcerns: string[];
    additionalSupport: string[];
    mentalDemands: string;
    cognitiveChanges: string;
    areasForHelp: string[];
    additionalInfo: string;
    [key: string]: string | string[];
  };

  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("assessmentData")
      return savedData
        ? JSON.parse(savedData)
        : {
            primaryConcerns: [],
            additionalSupport: [],
            mentalDemands: "",
            cognitiveChanges: "",
            areasForHelp: [],
            additionalInfo: "",
          }
    }
    return {
      primaryConcerns: [],
      additionalSupport: [],
      mentalDemands: "",
      cognitiveChanges: "",
      areasForHelp: [],
      additionalInfo: "",
    }
  })

  useEffect(() => {
    localStorage.setItem("assessmentData", JSON.stringify(formData))
  }, [formData])

  const handleCheckboxChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev: FormData) => {
      const currentValues = prev[field] as string[]
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter((item) => item !== value),
        }
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value],
        }
      }
    })
  }

  const handleRadioChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTextChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      router.push(`/dashboard/patient/cognitive-assessment/${currentStep + 2}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      router.push(`/dashboard/patient/cognitive-assessment/${currentStep}`)
    }
  }

  const handleSubmit = async () => {
    const res = await fetch("/api/db/patient/cognitive-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    })
    router.push("/dashboard/patient/cognitive-assessment/loading")
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Primary Concerns
        return formData.primaryConcerns.length > 0
      case 3: // Mental Demands
        return formData.mentalDemands !== ""
      case 4: // Cognitive Changes
        return formData.cognitiveChanges !== ""
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep />
      case 1:
        return (
          <PrimaryConcernsStep
            selectedConcerns={formData.primaryConcerns}
            onChange={(value) => handleCheckboxChange("primaryConcerns", value)}
          />
        )
      case 2:
        return (
          <AdditionalSupportStep
            selectedSupport={formData.additionalSupport}
            onChange={(value) => handleCheckboxChange("additionalSupport", value)}
          />
        )
      case 3:
        return (
          <MentalDemandsStep
            selected={formData.mentalDemands}
            onChange={(value) => handleRadioChange("mentalDemands", value)}
          />
        )
      case 4:
        return (
          <CognitiveChangesStep
            selected={formData.cognitiveChanges}
            onChange={(value) => handleRadioChange("cognitiveChanges", value)}
          />
        )
      case 5:
        return (
          <AreasForHelpStep
            selectedAreas={formData.areasForHelp}
            onChange={(value) => handleCheckboxChange("areasForHelp", value)}
          />
        )
      case 6:
        return (
          <AdditionalInfoStep
            value={formData.additionalInfo}
            onChange={(value) => handleTextChange("additionalInfo", value)}
          />
        )
      case 7:
        return <ReviewStep formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStepContent()}
      </motion.div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep} disabled={!isStepValid()} className="flex items-center gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}

