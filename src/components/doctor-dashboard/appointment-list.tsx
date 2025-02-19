import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { AppointmentsInterface } from "~/server/db/type"
import { PatientDict } from "~/app/context/DoctorDashboardContext"

interface AppointmentListProps {
  appointments: AppointmentsInterface[]
  patientDict: PatientDict
}

export function AppointmentList({ appointments, patientDict }: AppointmentListProps) {
  if (!appointments || !patientDict) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{`${patientDict[appointment.patientId]?.patient.firstName} ${patientDict[appointment.patientId]?.patient.lastName}`}</p>
                <p className="text-sm text-muted-foreground">{new Date(appointment.scheduledAt).toLocaleString()}</p>
              </div>
              <Badge variant={appointment.status === 'Scheduled' ? "default" : "secondary"}>{appointment.status}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}