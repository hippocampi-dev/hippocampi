import Link from "next/link"
import Image from "next/image"
import { UserRound, Stethoscope } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

export default function HealthcarePortal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">Healthcare Portal</h1>
          <p className="mt-4 text-xl text-gray-600">Please select your login type</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Patient Login Card */}
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="bg-blue-50 pb-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <UserRound className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl">Patient Login</CardTitle>
              <CardDescription className="text-center">
                Access your medical records, appointments, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <Image
                  src="/placeholder.svg?height=180&width=320"
                  alt="Patient portal illustration"
                  width={320}
                  height={180}
                  className="rounded-lg"
                />
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  View upcoming appointments
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Access medical records
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Request prescription refills
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/portal/patient-login" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Patient Login</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Doctor Login Card */}
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="bg-green-50 pb-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl">Doctor Login</CardTitle>
              <CardDescription className="text-center">
                Access patient information, schedules, and clinical tools
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <Image
                  src="/placeholder.svg?height=180&width=320"
                  alt="Doctor portal illustration"
                  width={320}
                  height={180}
                  className="rounded-lg"
                />
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  View patient records
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Manage appointment schedule
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Access clinical resources
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/portal/doctor-login" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">Doctor Login</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Healthcare Portal. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="#" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Contact Support
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}