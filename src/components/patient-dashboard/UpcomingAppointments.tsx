import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Video } from "lucide-react";
import Link from "next/link";
import { getUserId } from "~/utilities/getUser";
import { getAppointments, getDoctor } from "~/server/db/queries";

// Mock data for appointments - replace with 

export default async function UpcomingAppointments() {
  const userId = (await getUserId()) as "string";
  const appointments = await getAppointments(userId);
  const upcomingAppointments = appointments.filter(
    apt => apt.status === "Scheduled" && new Date(apt.scheduledAt) > new Date()
  );
  
  const upcomingAppointmentsWithDoctor = await Promise.all(
    upcomingAppointments.map(async (apt) => {
      const doctor = await getDoctor(apt.doctorId as "string");
      return doctor
        ? { ...apt, doctorName: `${doctor.firstName} ${doctor.lastName}` }
        : { ...apt, doctorName: "Unknown Doctor" };
    })
  );
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {!appointments || appointments.length === 0 ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg text-gray-600">No upcoming appointments</p>
            <Link href="/dashboard/appointments/schedule">
              <Button>Schedule an Appointment</Button>
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col space-y-6">
            {upcomingAppointmentsWithDoctor.map((appointment) => (
              <li
                key={appointment.id}
                className="rounded border p-4 shadow-md"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold">
                    {appointment.doctorName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.scheduledAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-gray-700">
                    Reason: {appointment.reason}
                  </p>
                </div>
                <Button className="w-full" asChild>
                  <a
                    href={`/dashboard/patient/video-call/${appointment.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Join Video Call
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
