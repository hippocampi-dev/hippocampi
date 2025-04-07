import Link from "next/link"
import Image from "next/image"
import { UserRound, Stethoscope } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import Footer from "~/components/ui/Footer"
import { Header } from "~/components/ui/Header"

export default function HealthcarePortal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="mx-auto px-4 py-8 flex items-center">
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Patient Login Card */}
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="bg-blue-50 pb-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <UserRound className="h-8 w-8 text-primary" />
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
                  src="https://images.unsplash.com/photo-1606166228927-3feafb447265?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Patient portal illustration"
                  width={999}
                  height={999}
                  className="rounded-lg object-cover aspect-square"
                />
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  View upcoming appointments
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Access medical records
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Request prescription refills
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/portal/patient-login" className="w-full">
                <Button className="w-full">Patient Login</Button>
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
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Patient portal illustration"
                  width={999}
                  height={999}
                  className="rounded-lg object-cover aspect-square"
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
      </div>

    <Footer />
    </div>
  )
}