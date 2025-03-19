"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppointmentsInterface, DoctorsInterface } from "~/server/db/type";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { fetchDoctorDetails, updateAppointmentStatusAction } from "~/app/_actions/schedule/actions";

interface CurrentAppointmentsProps {
  appointments: AppointmentsInterface[];
}

export function CurrentAppointments({ appointments }: CurrentAppointmentsProps) {
  const [appointmentData, setAppointmentData] = useState<Array<AppointmentsInterface & { doctor?: DoctorsInterface }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetailsEffect = async () => {
      try {
        const enhancedAppointments = await Promise.all(
          appointments.map(async (appointment) => {
            try {
              const data = await fetchDoctorDetails(appointment.doctorId as "string");
              console.log("Fetched doctor data:", data);
              return {
                ...appointment,
                doctor: data,
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
        
        // Sort by date (newest first)
        enhancedAppointments.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
        
        setAppointmentData(enhancedAppointments);
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetailsEffect();
  }, [appointments]);

  const updateAppointmentStatus = async (id: string, status: "Scheduled" | "Completed" | "Canceled" | "No-Show") => {
    try {
      const response = await updateAppointmentStatusAction(id, status)
      console.log("Updated appointment status:", response);

      // Update local state
      setAppointmentData(prev => 
        prev.map(apt => apt.id === id ? { ...apt, status } : apt)
      );
      
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error(`Failed to update appointment: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(error);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      const response = await updateAppointmentStatusAction(id, "Canceled");

      // Update local state
      setAppointmentData(prev => 
        prev.map(apt => apt.id === id ? { ...apt, status: "Canceled" } : apt)
      );
      
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      toast.error(`Failed to cancel appointment: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10">Loading appointments...</div>;
  }

  if (appointmentData.length === 0) {
    return (
      <div className="text-center py-10">
        <p>You have no scheduled appointments.</p>
      </div>
    );
  }

  // Group appointments by status
  const upcomingAppointments = appointmentData.filter(apt => apt.status === "Scheduled" && new Date(apt.scheduledAt) > new Date());
  const pastAppointments = appointmentData.filter(apt => 
    apt.status === "Completed" || apt.status === "Canceled" || apt.status === "No-Show" || new Date(apt.scheduledAt) <= new Date()
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                onCancel={() => handleCancelAppointment(appointment.id!)} 
                onUpdateStatus={(status) => updateAppointmentStatus(appointment.id!, status)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming appointments</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
        {pastAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                isPast 
                onUpdateStatus={(status) => updateAppointmentStatus(appointment.id!, status)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No past appointments</p>
        )}
      </div>
    </div>
  );
}

interface AppointmentCardProps {
  appointment: AppointmentsInterface & { doctor?: DoctorsInterface };
  onCancel?: () => void;
  onUpdateStatus?: (status: "Scheduled" | "Completed" | "Canceled" | "No-Show") => void;
  isPast?: boolean;
}

function AppointmentCard({ appointment, onCancel, onUpdateStatus, isPast = false }: AppointmentCardProps) {
  const statusColors: Record<string, string> = {
    Scheduled: "bg-green-100 text-green-800",
    Canceled: "bg-red-100 text-red-800",
    Completed: "bg-blue-100 text-blue-800",
    "No-Show": "bg-orange-100 text-orange-800",
  };

  const formattedDate = format(new Date(appointment.scheduledAt), "MMM dd, yyyy");
  const formattedTime = format(new Date(appointment.scheduledAt), "h:mm a");
  
  const now = new Date();
  const appointmentDate = new Date(appointment.scheduledAt);
  const isInPast = appointmentDate < now;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}</CardTitle>
            <CardDescription>{appointment.doctor?.specialization}</CardDescription>
          </div>
          <Badge className={statusColors[appointment.status ?? "Scheduled"]}>{appointment.status ?? "Scheduled"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time:</span>
            <span>{formattedTime}</span>
          </div>
          {appointment.reason && (
            <div>
              <p className="text-sm text-muted-foreground">Reason:</p>
              <p className="text-sm">{appointment.reason}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {!isPast && appointment.status === "Scheduled" && onCancel && (
          <Button 
            variant="outline" 
            className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            onClick={onCancel}
          >
            Cancel Appointment
          </Button>
        )}
        
        {isInPast && appointment.status === "Scheduled" && onUpdateStatus && (
          <div className="w-full grid grid-cols-2 gap-2">
            <Button 
              size="sm"
              variant="outline"
              className="hover:bg-blue-50 hover:text-blue-600"
              onClick={() => onUpdateStatus("Completed")}
            >
              Mark Completed
            </Button>
            <Button 
              size="sm"
              variant="outline" 
              className="hover:bg-orange-50 hover:text-orange-600"
              onClick={() => onUpdateStatus("No-Show")}
            >
              Mark No-Show
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
