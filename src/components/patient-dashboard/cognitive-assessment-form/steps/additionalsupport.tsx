import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"

interface AdditionalSupportStepProps {
  selectedSupport: string[]
  onChange: (value: string) => void
}

export default function AdditionalSupportStep({ selectedSupport, onChange }: AdditionalSupportStepProps) {
  const supportAreas = [
    "Alzheimer's Diseases and other Dementias",
    "Parkinson's Disease",
    "Stroke Recovery",
    "Multiple Sclerosis",
    "Epilepsy and Seizure Disorders",
    "Huntington's Disease",
    "Traumatic Brain Injury",
    "Brain Tumors and Lesions",
  ]

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Additional Support Areas</CardTitle>
        <CardDescription>What else can we support you with? Select all that apply.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {supportAreas.map((area) => (
            <div key={area} className="flex items-start space-x-3">
              <Checkbox id={area} checked={selectedSupport.includes(area)} onCheckedChange={() => onChange(area)} />
              <Label htmlFor={area} className="font-normal cursor-pointer">
                {area}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

