import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <div className="mx-auto max-w-[800px] space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Doctor Onboarding Portal</h1>
        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Welcome to our streamlined onboarding process for healthcare professionals.
        </p>
      </div>
      <div className="grid w-full max-w-5xl gap-6 py-12 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>New Doctors</CardTitle>
            <CardDescription>Start your onboarding process with us</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground">
              Our streamlined onboarding process helps you submit your credentials and join our network quickly and
              efficiently.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/auth/login" className="w-full">
              <Button className="w-full">Start Onboarding</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Existing Applications</CardTitle>
            <CardDescription>Continue your onboarding process</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground">
              Already started the onboarding process? Sign in to continue where you left off or check your application
              status.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}