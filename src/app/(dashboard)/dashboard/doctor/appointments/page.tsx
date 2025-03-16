export const dynamic = "force-dynamic"

import { Suspense } from "react";
import DoctorAppointments from "~/components/doctor-dashboard/DoctorAppointments";
import { getAppointments, getPatientDict } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<AppointmentsLoadingSkeleton />}>
      <AppointmentsContainer />
    </Suspense>
  );
}

async function AppointmentsContainer() {
  // Get the doctor ID first
  const doctorId = await getUserId() as "string";
  
  // Start both data fetching operations in parallel
  const appointmentsPromise = getAppointments(doctorId);
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

function AppointmentsLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}