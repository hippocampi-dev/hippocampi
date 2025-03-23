'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { AppointmentsInterface, PatientDict } from "~/server/db/type"
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface props {
  appointments: AppointmentsInterface[],
  patientDict: PatientDict;
}

export default function PreviousDoctorAppointments({ appointments, patientDict }: props) {
  const router = useRouter();

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-2">Previous Appointments</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Appointment Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{`${patientDict[appointment.patientId]?.patient.firstName} ${patientDict[appointment.patientId]?.patient.lastName}`}</TableCell>
              <TableCell>{new Date(appointment.scheduledAt).toLocaleString()}</TableCell>
              <TableCell>{appointment.reason}</TableCell>
              <TableCell>{appointment.notes}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <Button 
                  onClick={() => {
                    appointment.id && router.push(`/dashboard/doctor/appointments/${appointment.id}/details`)
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {appointments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">No previous appointments found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
