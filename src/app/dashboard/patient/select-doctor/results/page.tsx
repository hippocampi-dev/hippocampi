"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { ArrowLeft, Printer } from "lucide-react"

interface Doctor {
  name: string
  specialty: string
  reason: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [aiResponse, setAiResponse] = useState<string>("")
  const [formData, setFormData] = useState<any>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    const results = localStorage.getItem("assessmentResults")
    const data = localStorage.getItem("assessmentData")
    
    console.log(data);
    

    if (data) {
      try {
        setFormData(JSON.parse(data))
      } catch (e) {
        console.error("Error parsing form data:", e)
      }
    }
  }, [])

  const handleStartNew = () => {
    localStorage.removeItem("assessmentResults")
    localStorage.removeItem("assessmentData")
    router.push("/assessment/1")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Your Personalized Assessment Results</CardTitle>
          <CardDescription>
            Based on your responses, we've generated personalized insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-blue max-w-none">
            {aiResponse ? (
              <div className="whitespace-pre-line">{aiResponse}</div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No assessment results found. Please complete the assessment form.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <p className="text-sm text-muted-foreground">
            These insights are generated based on your assessment responses and are meant to provide general guidance.
            For personalized medical advice, please consult with a healthcare professional.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleStartNew} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> New Assessment
            </Button>
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" /> Print Results
            </Button>
          </div>
        </CardFooter>
      </Card>

      {doctors.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Suggested Doctors</CardTitle>
            <CardDescription>Based on your assessment, these specialists may be able to help you.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctors.map((doctor, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-muted-foreground">{doctor.specialty}</p>
                  <p className="mt-2">{doctor.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {formData && (
        <Card className="border-primary/20 print:hidden">
          <CardHeader>
            <CardTitle className="text-xl">Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium">Primary Concerns</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {formData.primaryConcerns.length > 0 ? (
                  formData.primaryConcerns.map((concern: string) => (
                    <li key={concern} className="text-muted-foreground">
                      {concern}
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">None selected</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Additional Support Areas</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {formData.additionalSupport.length > 0 ? (
                  formData.additionalSupport.map((support: string) => (
                    <li key={support} className="text-muted-foreground">
                      {support}
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">None selected</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Mental Demands</h3>
              <p className="text-muted-foreground mt-2">{formData.mentalDemands || "Not specified"}</p>
            </div>

            <div>
              <h3 className="font-medium">Cognitive Changes</h3>
              <p className="text-muted-foreground mt-2">{formData.cognitiveChanges || "Not specified"}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

