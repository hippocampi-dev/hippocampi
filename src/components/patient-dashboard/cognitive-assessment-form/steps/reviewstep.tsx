import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

interface ReviewStepProps {
  formData: {
    primaryConcerns: string[]
    additionalSupport: string[]
    mentalDemands: string
    cognitiveChanges: string
    areasForHelp: string[]
    additionalInfo: string
  }
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Review Your Assessment</CardTitle>
        <CardDescription>Please review your responses before submitting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium text-lg">Primary Concerns</h3>
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
          <h3 className="font-medium text-lg">Additional Support Areas</h3>
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
          <h3 className="font-medium text-lg">Mental Demands</h3>
          <p className="text-muted-foreground mt-2">{formData.mentalDemands || "Not specified"}</p>
        </div>

        <div>
          <h3 className="font-medium text-lg">Cognitive Changes</h3>
          <p className="text-muted-foreground mt-2">{formData.cognitiveChanges || "Not specified"}</p>
        </div>

        <div>
          <h3 className="font-medium text-lg">Areas for Help</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {formData.areasForHelp.length > 0 ? (
              formData.areasForHelp.map((area: string) => (
                <li key={area} className="text-muted-foreground">
                  {area}
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">None selected</li>
            )}
          </ul>
        </div>

        {formData.additionalInfo && (
          <div>
            <h3 className="font-medium text-lg">Additional Information</h3>
            <p className="text-muted-foreground mt-2 whitespace-pre-line">{formData.additionalInfo}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Click Submit to process your assessment and receive personalized insights.
      </CardFooter>
    </Card>
  )
}

