'use client'

import { useContext, useEffect, useState } from "react"
import { DoctorDashboardContext } from "~/app/context/DoctorDashboardContext"
import { PatientCard } from "~/components/doctor-dashboard/patient-card"
import Error from "~/components/error/page"
import Loading from "~/components/loading/page"
import { Input } from "~/components/ui/input"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const context = useContext(DoctorDashboardContext);

  useEffect(() => {
    // console.log('Context Data:', JSON.stringify(context?.data, null, 2))
    // console.log('Patients Array:', context?.data?.patients)
  }, [context])

  if (!context || context.isLoading || !context.data) {
    return <Loading />
  }

  if (context.error) {
    return <Error />
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Patients</h1>
      <Input
        type="search"
        placeholder="Search patients..."
        className="max-w-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {context.data?.patients!.map((patient) => (
          <PatientCard
            key={patient.patientId}
            patient={patient}
            patientDict={context.data?.patientDict || {}}
          />
        ))}
      </div>
    </div>
  )
}