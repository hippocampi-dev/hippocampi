import { PatientCard } from "~/components/doctor-dashboard/PatientCard"
import PatientSearchInput from "~/components/doctor-dashboard/PatientSearchInput";
import { getPatients } from "~/server/db/queries";
import { getUserId } from "~/utilities/get-user";

export default async function PatientsPage() {
  const userId = await getUserId();
  const patients = await getPatients(userId as "string");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Patients</h1>
      {/* <PatientSearchInput /> */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <PatientCard
            id={patient.patientId as "string"}
            key={patient.patientId}
          />
        ))}
      </div>
    </div>
  )
}