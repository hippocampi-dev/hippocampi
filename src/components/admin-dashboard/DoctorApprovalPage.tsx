"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { DoctorDict } from "~/server/db/type"
import { NPICredentialView } from "./credentials-view/NpiView"
import { CredentialsInterface } from "~/app/(dashboard)/onboarding/credentials/page"
import { LicenseCredentialView } from "./credentials-view/LicenseView"
import { DEACredentialView } from "./credentials-view/DeaView"
import { MalpracticeCredentialView } from "./credentials-view/MalpracticeView"
import { CertificationsCredentialView } from "./credentials-view/CertificationsView"
import { updateDoctorOnboardingStatus } from "~/app/_actions/onboarding/actions"

interface props {
  id: string
  dict: DoctorDict
  data: CredentialsInterface
}

export default function DoctorApprovalPage({ id, dict, data }: props) {
  const [doctor, setDoctor] = useState(dict[id]);

  const router = useRouter();

  const handleApprove = async () => {

    await updateDoctorOnboardingStatus('approved', id).then(
      () => setTimeout(() => {
      router.push("/dashboard/admin")
    }, 500))
  }

  const handleReject = async () => {

    await updateDoctorOnboardingStatus('rejected', id).then(
      () => setTimeout(() => {
      router.push("/dashboard/admin")
    }, 500))
  }
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{`${doctor?.doctor.firstName} ${doctor?.doctor.lastName}`}</h1>
          <p className="text-muted-foreground">{doctor?.doctor.email}</p>
        </div>
        <Badge
          className="ml-auto"
          variant={doctor?.doctor.onboardingStatus === "pending" ? "outline" : doctor?.doctor.onboardingStatus === "approved" ? "success" : "destructive"}
        >
          {doctor!.doctor!.onboardingStatus!.charAt(0).toUpperCase() + doctor?.doctor!.onboardingStatus!.slice(1)}
        </Badge>
      </div>

      {doctor?.doctor.onboardingStatus === "approved" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Credentials Approved</AlertTitle>
          <AlertDescription>This doctor's credentials have been approved.</AlertDescription>
        </Alert>
      )}


      {doctor?.doctor.onboardingStatus === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Credential Review</CardTitle>
            <CardDescription>Review all credentials before making an approval decision</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end gap-4 mb-6">
              {/* <Button variant="destructive" onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject Credentials
              </Button> */}

              <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Credentials
              </Button>
            </div>

            <Tabs defaultValue="npi">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="npi">NPI</TabsTrigger>
                <TabsTrigger value="license">License</TabsTrigger>
                <TabsTrigger value="dea">DEA</TabsTrigger>
                <TabsTrigger value="malpractice">Malpractice</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
              </TabsList>

              <TabsContent value="npi">
                <NPICredentialView data={data.npi} />
              </TabsContent>

              <TabsContent value="license">
                <LicenseCredentialView data={data.license} />
              </TabsContent>

              <TabsContent value="dea">
                <DEACredentialView data={data.dea} />
              </TabsContent>

              <TabsContent value="malpractice">
                <MalpracticeCredentialView data={data.malpractice} />
              </TabsContent>

              <TabsContent value="certifications">
                <CertificationsCredentialView data={data.certifications} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}