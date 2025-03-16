"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { formatTimeWithAMPM } from "~/lib/utils";

// Remove the server action import
// import { scheduleAppointment } from "./actions";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: {
    date: Date;
    formattedDate: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    availabilityId: string;
  };
  doctorId: string;
  patientId: string;
}

export function BookingModal({ open, onOpenChange, slot, doctorId, patientId }: BookingModalProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create a Date object combining the slot date with the start time
      const [hours, minutes] = slot.startTime.split(':').map(Number);
      
      if (hours === undefined || minutes === undefined) {
        throw new Error("Invalid startTime format");
      }

      const scheduledAt = new Date(slot.date);
      scheduledAt.setHours(hours, minutes);

      // Use fetch to call the API endpoint instead of direct server action
      const response = await fetch('/api/db/management/appointments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId,
          patientId,
          scheduledAt,
          reason,
          notes
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to book appointment");
      }
      
      toast.success("Appointment booked successfully", {
        description: "Click to view your appointments",
        action: {
          label: "View",
          onClick: () => {
            // Use a custom data attribute to trigger tab switch
            const tabsElement = document.querySelector('[data-tabs-list]');
            if (tabsElement) {
              const currentTabButton = tabsElement.querySelector('[data-state="active"]');
              const appointmentsTabButton = tabsElement.querySelector('[value="current"]');
              if (currentTabButton && appointmentsTabButton) {
                (appointmentsTabButton as HTMLButtonElement).click();
              }
            }
          }
        }
      });
      
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to book appointment", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment for {slot.formattedDate} at {formatTimeWithAMPM(slot.startTime)}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for consultation</Label>
            <Input 
              id="reason" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g., Follow-up, New symptoms, Prescription renewal"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional notes (optional)</Label>
            <Textarea 
              id="notes" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific concerns or information you'd like to share"
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !reason.trim()}>
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
