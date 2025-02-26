import { getAppointment, getPatient } from "~/server/db/queries"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge";

export default async function AppointmentDetailsPage({ params }: { params: { id: string } }) {
  const appointment = await getAppointment(params.id);

  if (!appointment) {
    return null;
  }

  const patient = await getPatient(appointment.patientId as "string");

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h2 className="text-xl font-semibold">Patient Name</h2>
              <p>{`${patient?.firstName} ${patient?.lastName}`}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Reason</h2>
              <p>{appointment.reason}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Notes</h2>
              <p>{appointment.notes}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Time</h2>
              <p>{new Date(appointment.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Status</h2>
              <Badge variant={appointment.status === "Scheduled" ? "default" : "secondary"}>{appointment.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}