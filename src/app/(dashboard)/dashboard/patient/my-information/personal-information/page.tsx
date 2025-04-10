export const dynamic = "force-dynamic"

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "~/components/loading/page";
import { ChangeInformationForm } from "~/components/patient-dashboard/ChangeInformationForm"
import { Button } from "~/components/ui/button";
import { PatientSchemaType } from "~/lib/schemas/patients";
import { getPatient } from "~/server/db/queries";
import { PatientsInterface } from "~/server/db/type";
import { getUserId } from "~/utilities/getUser"

export default function ChangeInformationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ChangeInformationContainer />
    </Suspense>
  );
}

async function ChangeInformationContainer() {
  const userId = await getUserId() as string;
  const userIdString = userId as "string";
    if (!userId) {
      notFound();
    }
  const patient = await getPatient(userIdString) as PatientsInterface as PatientSchemaType;
  // console.log(patient)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6"><Link href="/dashboard/patient/my-information" passHref>
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>Change Information</h1>
      <ChangeInformationForm userId = {userIdString} patient = {patient}/>
    </div>
  )
}
