import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Textarea } from "~/components/ui/textarea"

interface AdditionalInfoStepProps {
  value: string
  onChange: (value: string) => void
}

export default function AdditionalInfoStep({ value, onChange }: AdditionalInfoStepProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Additional Information</CardTitle>
        <CardDescription>Please share any other information you want us to know about.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter any additional details that might help us understand your situation better..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[150px]"
        />
      </CardContent>
    </Card>
  )
}

