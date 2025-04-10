import { Suspense } from "react";
import UpcomingDoctorAppointments from "~/components/doctor-dashboard/DoctorAppointments";
import PreviousDoctorAppointments from "~/components/doctor-dashboard/PreviousDoctorAppointments";
import Loading from "~/components/loading/page";
import { getPatientDict, getUnreviewedAppointments, getCompletedAppointments } from "~/server/db/queries";
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
    <div className="space-y-8">
      <UpcomingDoctorAppointments
        appointments={upcomingAppointments}
        patientDict={patientDict}
      />
      <PreviousDoctorAppointments
        appointments={completedAppointments}
        patientDict={patientDict}
      />
    </div>
  );
}