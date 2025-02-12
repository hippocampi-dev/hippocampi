'use client';

import { useState, useEffect } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PatientsInterface } from '~/server/db/type';

interface AppointmentFormProps {
  patientId?: string,
  patientList?: PatientsInterface[],
  onSchedule: (appointment: {
    patientId: string,
    date: Date,
    reason: string,
    notes: string
  }) => void
  onCancel: () => void
  initialDate?: Date | null
}

export function AppointmentForm({
  patientId: initialPatientId,
  patientList,
  onSchedule,
  onCancel,
  initialDate,
}: AppointmentFormProps) {
  const [patientId, setPatientId] = useState(initialPatientId || "")
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate.toISOString().split("T")[0]!);
      setTime(initialDate.toTimeString().slice(0, 5));
    }
  }, [initialDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId && date && time && reason) {
      const appointmentDate = new Date(`${date}T${time}:00`)
      onSchedule({
        patientId: patientId,
        date: appointmentDate,
        reason: reason,
        notes: ''
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!initialPatientId && (
        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Select onValueChange={setPatientId} value={patientId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patientList?.map((patient) => (
                <SelectItem key={patient.patientId} value={patient.patientId}>
                  {`${patient.firstName} ${patient.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Appointment</Label>
        <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Schedule Appointment</Button>
      </div>
    </form>
  )
}