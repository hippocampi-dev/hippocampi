"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, parse } from "date-fns";
import { formatTimeWithAMPM } from "~/lib/utils";
import { BookingModal } from "./BookingModal";

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

export function AvailabilityCarousel({ doctorId, patientId }: AvailabilityCarouselProps) {
  const [availabilities, setAvailabilities] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAvailabilities() {
      try {
        setLoading(true);
        const response = await fetch(`/api/db/doctor/availability/get?id=${doctorId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch availabilities");
        }
        
        setAvailabilities(data.availabilities);
      } catch (error) {
        console.error("Failed to load availabilities:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadAvailabilities();
  }, [doctorId]);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center py-10">Loading availabilities...</div>;
  }

  if (availabilities.length === 0) {
    return (
      <div className="text-center py-10">
        <p>This doctor has no available time slots in the next two weeks.</p>
      </div>
    );
  }

  // Group availabilities by date
  const availabilitiesByDate = availabilities.reduce((acc, slot) => {
    const dateStr = slot.formattedDate;
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

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
          {Object.entries(availabilitiesByDate).map(([date, slots]) => (
            <Card key={date} className="min-w-[240px] flex-shrink-0">
              <CardContent className="p-4">
                <div className="font-medium mb-2">{date}</div>
                <div className="text-sm text-muted-foreground mb-3">{slots[0]?.dayOfWeek}</div>
                <div className="grid gap-2">
                  {slots.map((slot) => (
                    <Button
                      key={`${slot.availabilityId}-${slot.startTime}`}
                      variant="outline"
                      className="text-xs justify-start h-auto py-2"
                      onClick={() => handleSlotSelect(slot)}
                    >
                      {formatTimeWithAMPM(slot.startTime)} - {formatTimeWithAMPM(slot.endTime)}
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
          slot={selectedSlot}
          doctorId={doctorId}
          patientId={patientId}
        />
      )}
    </>
  );
}
