import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { AppointmentsInterface } from "~/server/db/type"

interface AppointmentListProps {
  appointments: AppointmentsInterface[]
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  if (!appointments) {
    return (
      <></>
    )
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
                <p className="font-medium">{appointment.patientId}</p>
                <p className="text-sm text-muted-foreground">{appointment.scheduledAt.toLocaleString()}</p>
              </div>
              <Badge variant={appointment.status === 'Scheduled' ? "default" : "secondary"}>{appointment.status}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}