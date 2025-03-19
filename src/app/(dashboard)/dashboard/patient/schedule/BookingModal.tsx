"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { scheduleAppointment } from "~/app/_actions/schedule/actions";
import { formatTimeWithAMPM } from "~/lib/utils";

const formSchema = z.object({
  reason: z.string().min(5, "Please provide a reason that's at least 5 characters long"),
  notes: z.string().optional(),
});

interface AvailabilitySlot {
  date: Date;
  formattedDate: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  availabilityId: string;
}

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: AvailabilitySlot;
  doctorId: string;
  patientId: string;
}

export function BookingModal({
  open,
  onOpenChange,
  slot,
  doctorId,
  patientId,
}: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log("BookingModal - Slot received:", slot);
      
      // Parse the time from the slot
      // Create a proper date object from the date and time strings
      let scheduledDate;
      
      try {
        // For debugging
        console.log("Date input:", slot.date);
        console.log("Time input:", slot.startTime);
        
        // If slot.date is already a Date object
        if (slot.date instanceof Date) {
          scheduledDate = new Date(slot.date);
        } else {
          // If it's a string, parse it to a Date
          scheduledDate = new Date(slot.date);
        }
        
        // Now set the time from startTime (format: "HH:MM")
        const [hours, minutes] = slot.startTime.split(':').map(Number);
        scheduledDate.setHours(hours ?? 0, minutes ?? 0, 0, 0);
        
        console.log("Created scheduledDate:", scheduledDate);
        console.log("scheduledDate is valid:", !isNaN(scheduledDate.getTime()));
      } catch (err) {
        console.error("Error creating date:", err);
        throw new Error("Failed to create appointment date");
      }
      
      // Make sure we have a valid date before proceeding
      if (!scheduledDate || isNaN(scheduledDate.getTime())) {
        throw new Error("Invalid appointment date");
      }
      
      const appointmentData = {
        doctorId,
        patientId,
        scheduledAt: scheduledDate,
        reason: values.reason,
        notes: values.notes || "",
        status: "Scheduled" as const,
      };
      
      console.log("Submitting appointment data:", appointmentData);
      
      const result = await scheduleAppointment(appointmentData);
      toast.success("Appointment booked successfully!");
      onOpenChange(false);
      
      // Optionally refresh the page to show the new appointment
      window.location.reload();
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(`Failed to book appointment: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedStartTime = formatTimeWithAMPM(slot.startTime);
  const formattedEndTime = formatTimeWithAMPM(slot.endTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment for {slot.formattedDate} at {formattedStartTime} - {formattedEndTime}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for visit*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly describe your reason for this visit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional information your doctor should know" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
