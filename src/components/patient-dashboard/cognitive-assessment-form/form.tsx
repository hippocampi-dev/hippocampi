"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowLeft, ArrowRight, Check, Brain } from "lucide-react"
import { Button } from "~/components/ui/button"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Import step components
import WelcomeStep from "./steps/welcomestep"
import PrimaryConcernsStep from "./steps/primaryconcerns"
import AdditionalSupportStep from "./steps/additionalsupport"
import MentalDemandsStep from "./steps/mentaldemands"
import CognitiveChangesStep from "./steps/cognitivechanges"
import AreasForHelpStep from "./steps/areasforhelp"
import AdditionalInfoStep from "./steps/additionalinfo"
import ReviewStep from "./steps/reviewstep"
import ProgressBar from "./progressbar"

// Define the form steps
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

export default function CognitiveAssessmentForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    primaryConcerns: [] as string[],
    additionalSupport: [] as string[],
    mentalDemands: "",
    cognitiveChanges: "",
    areasForHelp: [] as string[],
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckboxChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
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
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Format the data for the AI prompt
      const prompt = `
        Cognitive Assessment Results:
        
        Primary Concerns: ${formData.primaryConcerns.join(", ")}
        
        Additional Support Areas: ${formData.additionalSupport.join(", ")}
        
        Mental Demands: ${formData.mentalDemands}
        
        Cognitive Changes: ${formData.cognitiveChanges}
        
        Areas for Help: ${formData.areasForHelp.join(", ")}
        
        Additional Information: ${formData.additionalInfo}
        
        Based on this assessment, please provide the ideal characteristics of a doctor suited for this patient, including their name and specialty.
      `

      // Call the AI API
      console.log((prompt));
      const res = await fetch("/api/chat/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prompt),
      });
      const result = await res.json();
      console.log(result.doctor);
      // Store the result in localStorage for the results page to access
      localStorage.setItem("assessmentResults", JSON.stringify(result))
      localStorage.setItem("assessmentData", JSON.stringify(formData))

      // Navigate to the results page
    router.push("/dashboard/patient/select-doctor/results")
    } catch (error) {
      console.error("Error submitting form:", error)
      localStorage.setItem(
        "assessmentResults",
        "There was an error processing your assessment. Please try again later.",
      )
    //   router.push("/results")
    } finally {
      setIsSubmitting(false)
    }
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

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep} disabled={!isStepValid()} className="flex items-center gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing
              </>
            ) : (
              <>
                Submit <Check className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

