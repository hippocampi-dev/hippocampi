import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"

interface MentalDemandsStepProps {
  selected: string
  onChange: (value: string) => void
}

export default function MentalDemandsStep({ selected, onChange }: MentalDemandsStepProps) {
  const options = [
    {
      value: "Low Demand",
      label: "Low Demand",
      description: "My day is mostly relaxed.",
    },
    {
      value: "Moderate Demand",
      label: "Moderate Demand",
      description: "I do face some challenging tasks, but most of my routine is pretty straightforward.",
    },
    {
      value: "High Demand",
      label: "High Demand",
      description: "I frequently tackle new problems or tasks that need my focused attention.",
    },
    {
      value: "Very High Demand",
      label: "Very High Demand",
      description: "My day is constantly fast paced or stressful, requiring intense mental effort almost all the time.",
    },
  ]

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Mental Demands Assessment</CardTitle>
        <CardDescription>
          How would you describe the overall mental demands and stress level of your typical day?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selected} onValueChange={onChange} className="space-y-4">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              onClick={() => onChange(option.value)}
            >
              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
              <div className="grid gap-1.5">
                <Label htmlFor={option.value} className="font-medium cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

