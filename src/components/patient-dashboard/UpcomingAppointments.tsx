import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Video, VideoIcon } from "lucide-react";
import Link from "next/link";
import { getUserId } from "~/utilities/getUser";
import { getAppointments, getDoctor } from "~/server/db/queries";
import { AppointmentsInterface } from "~/server/db/type";
import { addMinutes, isWithinInterval, subMinutes } from "date-fns";
import { redirect } from "next/navigation";

// Mock data for appointments - replace with 

export default async function UpcomingAppointments() {
  const userId = (await getUserId()) as "string";
  const appointments = await getAppointments(userId);
  const upcomingAppointments = appointments.filter(
    apt => apt.status === "Scheduled" && new Date(apt.scheduledAt) > new Date()
  );
  const isAppointmentActive = (appointment: AppointmentsInterface) => {
      const now = new Date();
      const appointmentTime = new Date(appointment.scheduledAt);
      
      return isWithinInterval(now, {
        start: subMinutes(appointmentTime, 30),
        end: addMinutes(appointmentTime, 30)
      });
  };

  const joinMeeting = (appointmentId: string) => {
    redirect(`/dashboard/meeting/${appointmentId}`);
  };

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
            <Link href="/dashboard/patient/schedule">
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
                <Button className="w-full" variant={isAppointmentActive(appointment) ? "default" : "outline"}
                    disabled={!isAppointmentActive(appointment)} asChild>
                  <a href={`/dashboard/meeting/${appointment.id}`} target="_blank" rel="noopener noreferrer">
                    <VideoIcon className="h-4 w-4 mr-2" />
                    {isAppointmentActive(appointment) ? "Join Now" : "Join Call"}
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
