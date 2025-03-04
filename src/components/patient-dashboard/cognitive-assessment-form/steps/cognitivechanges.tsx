import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"

interface CognitiveChangesStepProps {
  selected: string
  onChange: (value: string) => void
}

export default function CognitiveChangesStep({ selected, onChange }: CognitiveChangesStepProps) {
  const options = [
    {
      value: "No Change",
      label: "No Change",
      description: "My thinking, memory, and focus feel the same always.",
    },
    {
      value: "Slight Change",
      label: "Slight Change",
      description:
        "I've noticed some occasional forgetfulness or trouble concentrating, but it isn't affecting my daily life.",
    },
    {
      value: "Moderate Change",
      label: "Moderate Change",
      description:
        "I'm having noticeable differences with memory, focus and problem solving and it is starting to impact my routine.",
    },
    {
      value: "Significant Change",
      label: "Significant Change",
      description:
        "I'm struggling with serious cognitive issues that are interfering with my work, relationships, and daily tasks.",
    },
  ]

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Cognitive Changes Assessment</CardTitle>
        <CardDescription>Have you noticed any changes in your cognitive abilities over time?</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selected} onValueChange={onChange} className="space-y-4">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
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

