'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { AppointmentsInterface, PatientDict } from "~/server/db/type"
import { Button } from "../ui/button";
import { reviewAppointmentAction } from "~/app/_actions/schedule/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface props {
  appointments: AppointmentsInterface[],
  patientDict: PatientDict;
}

export default function UpcomingDoctorAppointments({ appointments, patientDict }: props) {
  const router = useRouter();
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());

  const reviewAppointment = async(appointmentId: string) => {
    const response = await reviewAppointmentAction(appointmentId);
    return response;
  }

  const dismissAppointment = async(appointmentId: string) => {
    // Mark appointment as dismissing
    setDismissingIds(prev => new Set(prev).add(appointmentId));
    
    // Handle dismissal logic here
    await reviewAppointmentAction(appointmentId);
  }

  // Check if appointment is active (scheduled and within 30 minutes of start time)
  const isAppointmentActive = (appointment: AppointmentsInterface) => {
    if (appointment.status !== "Scheduled") return false;
    
    const appointmentTime = new Date(appointment.scheduledAt);
    const now = new Date();
    
    // Appointment is in the past, but within 30 minutes (grace period)
    const isPast = appointmentTime < now;
    const diffMs = Math.abs(appointmentTime.getTime() - now.getTime());
    const diffMins = Math.floor(diffMs / 60000);
    
    // Active if appointment is in the future or within 30 minutes of past start time
    return !isPast || (isPast && diffMins <= 30);
  };

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
                {appointment.status === "Canceled" ? (
                  dismissingIds.has(appointment.id || "") ? (
                    <span className="text-gray-500 italic">Dismissing...</span>
                  ) : (
                    <Button 
                      variant="secondary" 
                      onClick={() => {appointment.id && dismissAppointment(appointment.id)}}
                    >
                      Dismiss
                    </Button>
                  )
                ) : appointment.status === "Completed" ? (
                  <Button 
                    onClick={() => {
                      appointment.id && router.push(`/dashboard/doctor/appointments/${appointment.id}/details/edit`)
                    }}
                  >
                    Review
                  </Button>
                ) : (
                  <Button
                    disabled={!isAppointmentActive(appointment)}
                    onClick={() => {
                      appointment.id && router.push(`/dashboard/meeting/${appointment.id}`)
                    }}
                  >
                    {isAppointmentActive(appointment) ? "Join Call" : "Open Link"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}