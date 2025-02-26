import { getUserId } from "~/utilities/get-user";
import PatientDetails from "../../../../../components/doctor-patient-details/patient"

interface props {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailsPage({ params }: props) {
  const { id } = await params;
  const doctorId = await getUserId() as "string";

  return (
    <PatientDetails
      patientId={id as "string"}
      doctorId={doctorId}
    />
  )
}

