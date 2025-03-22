export const dynamic = "force-dynamic"

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
  
  // Start both data fetching operations in parallel
  const appointmentsPromise = getUnreviewedAppointments(doctorId);
  const patientDictPromise = getPatientDict(doctorId);
  
  // Wait for both promises to resolve
  const [appointments, patientDict] = await Promise.all([
    appointmentsPromise,
    patientDictPromise
  ]);

  return (
    <DoctorAppointments
      appointments={appointments}
      patientDict={patientDict}
    />
  );
}