import { PatientList } from "./PatientList";

export default function DoctorDashboard() {

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <PatientList />
      </div>
    </div>
  )
}