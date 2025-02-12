'use client';

import { useState, useEffect } from 'react'
import { Calendar } from "~/components/ui/calendar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"

interface AppointmentFormProps {
  patientName: string
  onSchedule: (appointment: {
    appointmentDate: Date,
    reason: string,
    notes: string
  }) => void
  onCancel: () => void
}

export function AppointmentForm({ patientName, onSchedule, onCancel }: AppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [nextAvailableDate, setNextAvailableDate] = useState<Date>(new Date());

  useEffect(() => {
    // Set the next available date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNextAvailableDate(tomorrow);
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time && reason) {
      const appointment: Date = new Date(`${date.toDateString()} ${time}`);
      onSchedule({
        appointmentDate: appointment,
        reason: reason,
        notes: notes
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Schedule Appointment for {patientName}</h2>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => date < nextAvailableDate}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Appointment</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reason">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Schedule Appointment</Button>
      </div>
    </form>
  )
}