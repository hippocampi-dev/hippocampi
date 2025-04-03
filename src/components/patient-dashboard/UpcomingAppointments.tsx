'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { AppointmentsInterface, DoctorsInterface } from '~/server/db/type';
import { fetchDoctorDetails } from '~/app/_actions/schedule/actions';
import { format, isWithinInterval, addMinutes, subMinutes } from 'date-fns';
import { VideoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserId } from '~/utilities/getUser';

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Array<AppointmentsInterface & { doctor?: DoctorsInterface }>>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // In a real implementation, you would fetch appointments from your API
        // For demo purposes, we're using mock data
        const response = await fetch('/api/patient/appointments');
        const data = await response.json();
        
        if (data.appointments) {
          // Enhance appointments with doctor information
          const enhancedAppointments = await Promise.all(
            data.appointments.map(async (appointment: AppointmentsInterface) => {
              try {
                const doctor = await fetchDoctorDetails(appointment.doctorId as "string");
                return {
                  ...appointment,
                  doctor,
                  scheduledAt: new Date(appointment.scheduledAt)
                };
              } catch (error) {
                console.error("Error fetching doctor details:", error);
                return {
                  ...appointment,
                  scheduledAt: new Date(appointment.scheduledAt)
                };
              }
            })
          );
          
          setAppointments(enhancedAppointments);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // For demonstration, create some mock appointments if the API call isn't implemented
    const createMockAppointments = async () => {
      try {
        const userId = await getUserId();
        const now = new Date();
        
        // Create mock appointments
        const mockAppointments: AppointmentsInterface[] = [
          {
            id: "appointment-1",
            patientId: userId as string,
            doctorId: "doctor-1",
            scheduledAt: addMinutes(now, 15),
            reason: "Annual check-up",
            status: "Scheduled"
          },
          {
            id: "appointment-2",
            patientId: userId as string,
            doctorId: "doctor-2",
            scheduledAt: addMinutes(now, 60 * 24),
            reason: "Follow-up consultation",
            status: "Scheduled"
          }
        ];
        
        // Enhance with mock doctor data
        const enhancedAppointments = mockAppointments.map(appointment => ({
          ...appointment,
          doctor: {
            id: appointment.doctorId,
            firstName: "John",
            lastName: "Smith",
            specialization: "General Medicine",
            email: "john.smith@example.com"
          } as DoctorsInterface
        }));
        
        setAppointments(enhancedAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error creating mock appointments:", error);
        setLoading(false);
      }
    };
    
    // Try to fetch appointments, fall back to mock data
    fetchAppointments().catch(() => {
      createMockAppointments();
    });
  }, []);

  // Check if an appointment is active (within 30 minutes before or after scheduled time)
  const isAppointmentActive = (appointment: AppointmentsInterface) => {
    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledAt);
    
    return isWithinInterval(now, {
      start: subMinutes(appointmentTime, 30),
      end: addMinutes(appointmentTime, 30)
    });
  };

  const joinMeeting = (appointmentId: string) => {
    router.push(`/dashboard/meeting/${appointmentId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming appointments</p>
        ) : (
          <div className="space-y-4">
            {appointments
              .filter(apt => apt.status === "Scheduled")
              .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
              .slice(0, 3)
              .map(appointment => (
                <div key={appointment.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(appointment.scheduledAt), 'MMM dd, yyyy - h:mm a')}</p>
                    <p className="text-xs">{appointment.reason}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isAppointmentActive(appointment) ? "default" : "outline"}
                    disabled={!isAppointmentActive(appointment)}
                    onClick={() => joinMeeting(appointment.id as string)}
                  >
                    <VideoIcon className="h-4 w-4 mr-2" />
                    {isAppointmentActive(appointment) ? "Join Now" : "Join Call"}
                  </Button>
                </div>
              ))}
            <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/patient/schedule')}>
              View All Appointments
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
