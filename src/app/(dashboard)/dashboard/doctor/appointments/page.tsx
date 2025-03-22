import { Suspense } from "react";
import DoctorAppointments from "~/components/doctor-dashboard/DoctorAppointments";
import Loading from "~/components/loading/page";
import { getPatientDict, getUnreviewedAppointments } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AppointmentsContainer />
    </Suspense>
  );
}

async function AppointmentsContainer() {
  // Get the doctor ID first
  const doctorId = await getUserId() as "string";
  
  // Start all data fetching operations in parallel
  const upcomingAppointmentsPromise = getUnreviewedAppointments(doctorId);
  const completedAppointmentsPromise = getCompletedAppointments(doctorId);
  const patientDictPromise = getPatientDict(doctorId);
  
  // Wait for all promises to resolve
  const [upcomingAppointments, completedAppointments, patientDict] = await Promise.all([
    upcomingAppointmentsPromise,
    completedAppointmentsPromise,
    patientDictPromise
  ]);

  return (
    <DoctorAppointments
      appointments={appointments}
      patientDict={patientDict}
    />
  );
}