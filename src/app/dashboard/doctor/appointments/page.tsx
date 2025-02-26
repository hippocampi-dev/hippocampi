import DoctorAppointments from "~/components/doctor-dashboard/DoctorAppointments";
import { getAppointments, getPatientDict } from "~/server/db/queries";
import { getUserId } from "~/utilities/get-user";

export default async function AppointmentsPage() {
  const doctorId = await getUserId() as "string";
  const appointments = await getAppointments(doctorId);
  const patientDict = await getPatientDict(doctorId);

  return (
    <DoctorAppointments
      appointments={appointments}
      patientDict={patientDict}
    />
  )
}