'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { AppointmentsInterface, PatientDict } from "~/server/db/type"
import { Button } from "../ui/button";
import { reviewAppointmentAction } from "~/app/_actions/schedule/actions";
import { revalidatePath } from "next/cache";

interface props {
  appointments: AppointmentsInterface[],
  patientDict: PatientDict;
}

export default function DoctorAppointments({ appointments, patientDict }: props) {
  const reviewAppointment = async(appointmentId: string) => {
    const response = await reviewAppointmentAction(appointmentId);
    return response
  }
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
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow 
              key={appointment.id}
              className={appointment.status === "Canceled" ? "bg-red-100" : ""}
            >
              <TableCell>{`${patientDict[appointment.patientId]?.patient.firstName} ${patientDict[appointment.patientId]?.patient.lastName}`}</TableCell>
              <TableCell>{new Date(appointment.scheduledAt).toLocaleString()}</TableCell>
              <TableCell>{appointment.reason}</TableCell>
              <TableCell>{appointment.notes}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                
              <Button onClick={() => {appointment.id && reviewAppointment(appointment.id)}}>Review Appointment</Button>
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}