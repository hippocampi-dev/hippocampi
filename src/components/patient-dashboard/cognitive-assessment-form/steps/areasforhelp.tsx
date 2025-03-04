import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"

interface AreasForHelpStepProps {
  selectedAreas: string[]
  onChange: (value: string) => void
}

export default function AreasForHelpStep({ selectedAreas, onChange }: AreasForHelpStepProps) {
  const areas = [
    "Improving Memory Skills",
    "Strategies to Better Focus",
    "Thinking More Clearly",
    "Handling Stress and Anxiety",
    "Quieting Thoughts Before Sleeping",
    "Improving Sleep Quality",
    "Staying Motivated Daily",
    "Exercises/Activities to Rebuild Thinking",
    "Planning Your Day Better",
    "Nutrition and Lifestyle",
    "Managing your Medications",
    "Strengthening Support System",
  ]

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Areas for Help</CardTitle>
        <CardDescription>Which areas would you like more help with? Select all that apply.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areas.map((area) => (
            <div key={area} className="flex items-start space-x-3">
              <Checkbox id={area} checked={selectedAreas.includes(area)} onCheckedChange={() => onChange(area)} />
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

