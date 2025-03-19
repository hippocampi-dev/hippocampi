"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMinutes, isBefore, isAfter, parseISO } from "date-fns";
import { formatTimeWithAMPM } from "~/lib/utils";
import { BookingModal } from "./BookingModal";
import { AppointmentsInterface } from "~/server/db/type";
import { generateAvailableTimeSlots } from "~/lib/actions/schedule";

export interface AvailabilityCarouselProps {
  doctorId: string;
  patientId: string;
}

export interface AvailabilitySlot {
  date: Date;
  formattedDate: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  availabilityId: string;
}

export interface TimeSlot {
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
                  {slots[0] && new Date(slots[0].startTime).toLocaleDateString('en-US', { weekday: 'long' })}
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
