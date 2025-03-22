export const dynamic = "force-dynamic"

import { PatientCard } from "~/components/doctor-dashboard/PatientCard"
import { getPatients } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";
import { Suspense } from "react";
import { PatientsInterface } from "~/server/db/type";
import Loading from "~/components/loading/page";

export default async function PatientsPage() {
  const userId = await getUserId();
  
  // Only fetch patients after we have the userId
  const patients = await getPatients(userId as "string");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Patients</h1>
      <Suspense fallback={<Loading />}>
        <PatientsList patients={patients} />
      </Suspense>
    </div>
  )
}

interface props {
  patients: PatientsInterface[]
}

function PatientsList({ patients }: props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => (
        <PatientCard
          id={patient.patientId as "string"}
          key={patient.patientId}
        />
      ))}
    </div>
  );
}