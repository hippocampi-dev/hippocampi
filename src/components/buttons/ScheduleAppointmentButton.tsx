'use client'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { AppointmentForm } from "../doctor-appointments/appointment-form";
import { PatientsInterface } from "~/server/db/type";

interface props {
  patients: PatientsInterface[]
}

export default function ScheduleAppointmentButton({ patients }: props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleScheduleAppointment = () => {
    setIsDialogOpen(false);
  };

  const handleCancelAppointment = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Appointment</DialogTitle>
        <AppointmentForm
          // patientId={selectPatient()?.patientId}
          patients={patients}
          onSchedule={handleScheduleAppointment}
          onCancel={handleCancelAppointment}
        />
      </DialogContent>
    </Dialog>
  )
}