import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMinutes, isBefore, isAfter, parseISO } from "date-fns";
import { formatTimeWithAMPM } from "~/lib/utils";
import { AppointmentsInterface } from "~/server/db/type";
import { AvailabilitySlot, TimeSlot } from "~/app/(dashboard)/dashboard/patient/schedule/AvailabilityCarousel";


export const generateAvailableTimeSlots = (
    availabilities: AvailabilitySlot[],
    appointments: AppointmentsInterface[]
  ): Record<string, TimeSlot[]> => {
    const slotsByDate: Record<string, TimeSlot[]> = {};
    
    // Convert appointments to a map for easy lookup
    const appointmentMap: Record<string, Date[]> = {};
    
    appointments.forEach(apt => {
      if (apt.status === "Canceled") return; // Skip canceled appointments
      
      const aptDate = new Date(apt.scheduledAt);
      const dateKey = format(aptDate, 'yyyy-MM-dd');
      
      if (!appointmentMap[dateKey]) {
        appointmentMap[dateKey] = [];
      }
      
      appointmentMap[dateKey].push(aptDate);
    });
    
    // Process each availability
    availabilities.forEach(availability => {
      const dateString = format(availability.date, 'yyyy-MM-dd');
      const formattedDate = availability.formattedDate;
      
      if (!slotsByDate[formattedDate]) {
        slotsByDate[formattedDate] = [];
      }
      
      // Parse availability times
      const startTimeParts = availability.startTime.split(':').map(Number);
      const endTimeParts = availability.endTime.split(':').map(Number);
      
      // Create start and end datetime objects
      const startDateTime = new Date(availability.date);
      startDateTime.setHours(startTimeParts[0] ?? 0, startTimeParts[1] ?? 0, 0, 0);
      
      const endDateTime = new Date(availability.date);
      endDateTime.setHours(endTimeParts[0] ?? 0, endTimeParts[1], 0, 0);
      
      // Get appointments for this date
      const dateAppointments = appointmentMap[dateString] || [];
      
      // Generate 1-hour slots starting every 30 minutes
      let currentSlotStart = new Date(startDateTime);
      
      while (addMinutes(currentSlotStart, 30) <= endDateTime) {
        // Set each slot to be 1 hour long
        const slotEnd = addMinutes(currentSlotStart, 60);
        
        // Check if this slot conflicts with any existing appointment (1 hour buffer)
        let hasConflict = false;
        
        for (const appointmentDate of dateAppointments) {
          // Cannot schedule less than 1 hour before an appointment
          const oneHourBeforeAppointment = addMinutes(appointmentDate, -60);
          // Cannot schedule less than 1 hour after an appointment (appointments typically last 30 min)
          const oneHourAfterAppointment = addMinutes(appointmentDate, 60);
          
          // Check if slot overlaps with the buffer zones
          if (
            // If slot start is within the buffer zone
            (isAfter(currentSlotStart, oneHourBeforeAppointment) && 
             isBefore(currentSlotStart, oneHourAfterAppointment)) ||
            // If slot end is within the buffer zone
            (isAfter(slotEnd, oneHourBeforeAppointment) && 
             isBefore(slotEnd, oneHourAfterAppointment))
          ) {
            hasConflict = true;
            break;
          }
        }
        
        // Also check if the slot is in the past
        const now = new Date();
        if (currentSlotStart <= now) {
          hasConflict = true; // Cannot book slots in the past
        }
        
        // If no conflict, add this slot
        if (!hasConflict) {
          slotsByDate[formattedDate].push({
            startTime: currentSlotStart,
            endTime: slotEnd,
            formattedStartTime: format(currentSlotStart, 'HH:mm'),
            formattedEndTime: format(slotEnd, 'HH:mm'),
            availabilityId: availability.availabilityId
          });
        }
        
        // Move to the next slot - advance by 30 minutes
        currentSlotStart = addMinutes(currentSlotStart, 30);
      }
    });
    
    
    // Remove dates with no available slots
    Object.keys(slotsByDate).forEach(date => {
      if ((slotsByDate[date] ?? []).length === 0) {
        delete slotsByDate[date];
      }
    });
    
    return slotsByDate;
  };