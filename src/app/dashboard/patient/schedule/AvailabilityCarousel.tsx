"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMinutes, isBefore, isAfter, parseISO } from "date-fns";
import { formatTimeWithAMPM } from "~/lib/utils";
import { BookingModal } from "./BookingModal";
import { AppointmentsInterface } from "~/server/db/type";

interface AvailabilityCarouselProps {
  doctorId: string;
  patientId: string;
}

interface AvailabilitySlot {
  date: Date;
  formattedDate: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  availabilityId: string;
}

interface TimeSlot {
  startTime: Date;
  endTime: Date;
  formattedStartTime: string;
  formattedEndTime: string;
  availabilityId: string;
}

export function AvailabilityCarousel({ doctorId, patientId }: AvailabilityCarouselProps) {
  const [rawAvailabilities, setRawAvailabilities] = useState<AvailabilitySlot[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Record<string, TimeSlot[]>>({});
  const [existingAppointments, setExistingAppointments] = useState<AppointmentsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    formattedDate: string;
    startTime: Date;
    endTime: Date;
    availabilityId: string;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Fetch doctor's availabilities
        const availabilitiesResponse = await fetch(`/api/db/doctor/availability/get?id=${doctorId}`);
        const availabilitiesData = await availabilitiesResponse.json();
        
        if (!availabilitiesResponse.ok) {
          throw new Error(availabilitiesData.error || "Failed to fetch availabilities");
        }
        
        // Fetch doctor's existing appointments
        const appointmentsResponse = await fetch(`/api/db/doctor/appointments?id=${doctorId}`);
        const appointmentsData = await appointmentsResponse.json();
        
        if (!appointmentsResponse.ok) {
          throw new Error(appointmentsData.error || "Failed to fetch appointments");
        }
        
        // Process availabilities
        const processedAvailabilities = availabilitiesData.availabilities.map((slot: any) => ({
          ...slot,
          date: new Date(slot.date),
        }));
        
        setRawAvailabilities(processedAvailabilities);
        setExistingAppointments(appointmentsData.appointments || []);
        
        // Generate available slots based on availabilities and existing appointments
        const slots = generateAvailableTimeSlots(
          processedAvailabilities,
          appointmentsData.appointments || []
        );
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Failed to load availabilities:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [doctorId]);
  
  // Function to generate available time slots based on doctor's availabilities and existing appointments
  const generateAvailableTimeSlots = (
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
      startDateTime.setHours(startTimeParts[0], startTimeParts[1], 0, 0);
      
      const endDateTime = new Date(availability.date);
      endDateTime.setHours(endTimeParts[0], endTimeParts[1], 0, 0);
      
      // Get appointments for this date
      const dateAppointments = appointmentMap[dateString] || [];
      
      // Generate 30-minute slots between start and end times
      let currentSlotStart = new Date(startDateTime);
      
      while (addMinutes(currentSlotStart, 30) <= endDateTime) {
        const slotEnd = addMinutes(currentSlotStart, 30);
        
        // Check if this slot conflicts with any existing appointment (1 hour buffer)
        let hasConflict = false;
        
        for (const appointmentDate of dateAppointments) {
          // Cannot schedule less than 1 hour before an appointment
          const oneHourBeforeAppointment = addMinutes(appointmentDate, -60);
          // Cannot schedule less than 1 hour after an appointment (appointments typically last 30 min)
          const oneHourAfterAppointment = addMinutes(appointmentDate, 30 + 60);
          
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
        
        // Move to the next slot
        currentSlotStart = slotEnd;
      }
    });
    
    // Remove dates with no available slots
    Object.keys(slotsByDate).forEach(date => {
      if (slotsByDate[date].length === 0) {
        delete slotsByDate[date];
      }
    });
    
    return slotsByDate;
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSlotSelect = (date: string, slot: TimeSlot) => {
    // Debug the exact date format to ensure it's a proper Date object
    console.log("Selected slot start time:", slot.startTime);
    console.log("Selected slot start time type:", typeof slot.startTime);
    console.log("Is Date object?", slot.startTime instanceof Date);
    
    // Ensure we're passing a properly formatted date object
    let startTimeDate = slot.startTime;
    if (typeof startTimeDate === 'string') {
      startTimeDate = new Date(startTimeDate);
    }
    
    setSelectedSlot({
      date: slot.startTime,
      formattedDate: date,
      startTime: startTimeDate,
      endTime: slot.endTime,
      availabilityId: slot.availabilityId
    });
    setModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center py-10">Loading availabilities...</div>;
  }

  if (Object.keys(availableSlots).length === 0) {
    return (
      <div className="text-center py-10">
        <p>This doctor has no available time slots in the next two weeks.</p>
        <p className="text-sm text-muted-foreground mt-2">
          This could be due to a full schedule or no availabilities set up.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Available slots for the next 2 weeks</h4>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div 
          ref={carouselRef} 
          className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {Object.entries(availableSlots).map(([date, slots]) => (
            <Card key={date} className="min-w-[240px] flex-shrink-0">
              <CardContent className="p-4">
                <div className="font-medium mb-2">{date}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  {new Date(slots[0].startTime).toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="grid gap-2">
                  {slots.map((slot) => (
                    <Button
                      key={`${slot.availabilityId}-${slot.formattedStartTime}`}
                      variant="outline"
                      className="text-xs justify-start h-auto py-2"
                      onClick={() => handleSlotSelect(date, slot)}
                    >
                      {formatTimeWithAMPM(slot.formattedStartTime)} - {formatTimeWithAMPM(slot.formattedEndTime)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {selectedSlot && (
        <BookingModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          slot={{
            date: selectedSlot.date,
            formattedDate: selectedSlot.formattedDate,
            dayOfWeek: format(selectedSlot.date, 'EEEE'),
            startTime: format(selectedSlot.startTime, 'HH:mm'),
            endTime: format(selectedSlot.endTime, 'HH:mm'),
            availabilityId: selectedSlot.availabilityId
          }}
          doctorId={doctorId}
          patientId={patientId}
        />
      )}
    </>
  );
}
