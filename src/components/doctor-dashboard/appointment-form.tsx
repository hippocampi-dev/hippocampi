'use client';

import { useState, useEffect } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AppointmentsInterface, PatientsInterface } from '~/server/db/type';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

interface AppointmentFormProps {
  patients?: PatientsInterface[],
  onSchedule: () => void,
  onCancel?: () => void
}

const apppointmentFormSchema = z.object({
  patientId: z.string(),
  date: z.string(),
  time: z.string({
    required_error: "Please enter a time"
  }),
  reason: z.string().min(1, { message: 'Reason must be at least 1 character' }).max(100, {
    message: "Reason must not exceed 100 characters.",
  }),
  notes: z.string()
})

type AppointmentFormValues = z.infer<typeof apppointmentFormSchema>

export function AppointmentForm({
  patients,
  onSchedule,
  onCancel,
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(apppointmentFormSchema),
    defaultValues: {
      patientId: "",
      date: new Date().toISOString().split("T")[0], // Set default date to today
      time: "",
      reason: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true)
    try {
      // Parse the date string and create a Date object
      const [year, month, day] = data.date.split("-").map(Number)
      const [hours, minutes] = data.time.split(":").map(Number)

      // Create a new Date object using local time
      const appointmentDate = new Date(year!, month! - 1, day, hours, minutes);

      // Ensure the date is valid
      if (isNaN(appointmentDate.getTime())) {
        throw new Error("Invalid date or time")
      }

      const appointment: AppointmentsInterface = {
        patientId: data.patientId,
        doctorId: session?.user.id!,
        scheduledAt: appointmentDate,
        reason: data.reason,
        notes: data.notes,
      }

      // console.log(appointment); return;

      const response = await fetch("/api/db/management/appointments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      })

      if (!response.ok) {
        throw new Error("Failed to create appointment")
      }

      console.log("Appointment created successfully")
      form.reset();
      onSchedule();
    } catch (error) {
      console.error("Failed to create appointment:", error)
    } finally {
      setIsSubmitting(false);
    }
}

  return (
    <Card className="w-full max-w-2xl mx-auto my-9">
      <CardHeader>
        <CardTitle>Schedule an appointment</CardTitle>
        <CardDescription>Schedule an appointment with your patients</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients!.map((patient) => (
                        <SelectItem key={patient.patientId} value={patient.patientId}>
                          {`${patient.firstName} ${patient.lastName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter any relevant notes about the patient, meeting, or general thoughts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Schedule Appointment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}