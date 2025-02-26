import { redirect } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { AppointmentsInterface, PatientDict } from "~/server/db/type"

interface props {
  appointments: AppointmentsInterface[],
  patientDict: PatientDict;
}

export default function DoctorAppointments({ appointments, patientDict }: props) {

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-2">Appointments</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Appointment</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} onClick={() => redirect(`/dashboard/doctor/appointments/${appointment.id}`)}>
              <TableCell>{`${patientDict[appointment.patientId]?.patient.firstName} ${patientDict[appointment.patientId]?.patient.lastName}`}</TableCell>
              <TableCell>{new Date(appointment.scheduledAt).toLocaleString()}</TableCell>
              <TableCell>${appointment.reason}</TableCell>
              <TableCell>${appointment.notes}</TableCell>
              <TableCell>${appointment.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}