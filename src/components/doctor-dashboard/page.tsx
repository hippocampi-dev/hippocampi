'use client'

import Loading from "../loading/page";
import Error from "../error/page";
import { AppointmentList } from "./appointment-list";
import { PatientList } from "./patient-list";
import { useContext } from "react";
import { DoctorDashboardContext } from "~/app/context/DoctorDashboardContext";

export default function DoctorDashboard() {
  const context = useContext(DoctorDashboardContext);

  if (!context) {
    return <Loading />
  }

  if (context.isLoading) {
    return <Loading />
  }

  if (context.error) {
    return <Error />
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <AppointmentList
          appointments={context.data?.appointments!}
        />
        {/* <PatientList
          patients={context.data?.patients!}
          patientDict={context.data?.patientDict!}
        /> */}
      </div>
    </div>
  )
}