import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"

interface PrimaryConcernsStepProps {
  selectedConcerns: string[]
  onChange: (value: string) => void
}

export default function PrimaryConcernsStep({ selectedConcerns, onChange }: PrimaryConcernsStepProps) {
  const concerns = [
    "Memory Loss and Forgetfulness",
    "Concentration and Attention Issues",
    "Brain Fog",
    "Difficult with Daily Planning and Organization",
    "Anxiety and Depression",
    "Medication Management Support",
    "Headaches and Migraines",
    "Concerns about Alzheimers and Dementia",
    "Brain Injury or Concussion Follow Up",
    "Achieving Peak Mental Performance",
  ]

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Primary Concerns</CardTitle>
        <CardDescription>Select all that apply to your current situation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {concerns.map((concern) => (
            <div key={concern} className="flex items-start space-x-3">
              <Checkbox
                id={concern}
                checked={selectedConcerns.includes(concern)}
                onCheckedChange={() => onChange(concern)}
              />
              <Label htmlFor={concern} className="font-normal cursor-pointer">
                {concern}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">Please select at least one concern to continue.</CardFooter>
    </Card>
  )
}

