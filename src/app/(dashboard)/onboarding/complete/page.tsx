import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function OnboardingComplete() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Onboarding Complete!</CardTitle>
          <CardDescription>Thank you for submitting your credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Our team will review your submitted credentials (typically within 2-3 business days)</li>
              <li>You may receive emails requesting additional information if needed</li>
              <li>Once verified, you'll receive an email with your approval status</li>
              <li>After approval, you'll get access to our provider portal</li>
            </ol>
          </div>
          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2">Contact Information</h3>
            <p className="text-sm text-muted-foreground">
              If you have any questions or need assistance, please contact our provider support team:
            </p>
            <div className="mt-2 text-sm">
              <p>
                Email: <span className="font-medium">info@hippocampi.co</span>
              </p>
              <p>
                Phone: <span className="font-medium">+1 (818) 913-0022</span>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/" className="w-full">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}