import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function WelcomeStep() {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to Your Cognitive Assessment</CardTitle>
        <CardDescription>
          This assessment will help us understand your cognitive health needs and provide personalized support.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          We'll ask you a series of questions about your cognitive health, concerns, and goals. Your responses will help
          us create a tailored approach to support your brain health.
        </p>
        <p>
          This assessment takes approximately 5-7 minutes to complete. All information you provide is confidential and
          will only be used to improve your care.
        </p>
        <p className="font-medium">Let's get started by understanding your primary concerns.</p>
      </CardContent>
    </Card>
  )
}

