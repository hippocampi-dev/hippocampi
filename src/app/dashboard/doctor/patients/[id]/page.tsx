import PatientDetails from "~/components/doctor-patient-details/patient";
import { getAppointments, getPatient, getPatientHealthInformation, getPatients } from "~/server/db/queries";
import { getUserId } from "~/utilities/get-user";

interface props {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailsPage({ params }: props) {
  const { id } = await params;
  const doctorId = await getUserId() as "string";
  const patient = await getPatient(id as "string");
  const healthInfo = await getPatientHealthInformation(id as "string")
  const appointments = await getAppointments(id as "string")
  const patients = await getPatients(doctorId);

  return (
    <PatientDetails
      patientId={id as "string"}
      patient={patient!}
      healthInfo={healthInfo}
      appointments={appointments}
      patients={patients}
    />
  )
}

