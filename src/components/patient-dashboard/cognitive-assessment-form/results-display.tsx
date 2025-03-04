"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Loader2, Brain, ArrowLeft, Printer } from "lucide-react"

export default function ResultsDisplay() {
  const router = useRouter()
  const [aiResponse, setAiResponse] = useState<string>("")
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the assessment results from localStorage
    const results = localStorage.getItem("assessmentResults")
    const data = localStorage.getItem("assessmentData")

    if (results) {
      setAiResponse(results)
    }

    if (data) {
      try {
        setFormData(JSON.parse(data))
      } catch (e) {
        console.error("Error parsing form data:", e)
      }
    }

    setLoading(false)
  }, [])

  const handleStartNew = () => {
    // Clear the localStorage and navigate back to the form
    localStorage.removeItem("assessmentResults")
    localStorage.removeItem("assessmentData")
    router.push("/")
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading your assessment results...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Hippocampi</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-md">Your personalized cognitive assessment results</p>
      </div>

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

