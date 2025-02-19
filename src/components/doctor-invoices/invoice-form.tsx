"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import type { InvoicesInterface, PatientsInterface } from "~/server/db/type"
import { useSession } from "next-auth/react"
import { PatientDict } from "~/app/context/DoctorDashboardContext"

const invoiceFormSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  notes: z.string(),
  appointmentId: z.string({
    required_error: "Please select the appropriate meeting"
  })
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

interface Props {
  patients: PatientsInterface[]
  patientDict: PatientDict
}

export default function InvoiceForm({ patients, patientDict }: Props) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      patientId: "",
      notes: "",
      appointmentId: ""
    },
  });

  async function onSubmit(data: InvoiceFormValues) {
    setIsSaving(true)
    try {
      const invoice: InvoicesInterface = {
        patientId: data.patientId,
        doctorId: session?.user.id!,
        appointmentId: data.appointmentId,
        hourlyRate: process.env.NEXT_PUBLIC_HOURLY_RATE!,
        notes: data.notes,
      }

      const response = await fetch("/api/db/management/invoices/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      })

      if (!response.ok) {
        throw new Error("Failed to create invoice")
      }

      console.log("Patient invoice created successfully")
      form.reset() // Reset form after successful submission
    } catch (error) {
      console.error("Failed to create patient invoice:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-9">
      <CardHeader>
        <CardTitle>Create an invoice</CardTitle>
        <CardDescription>Create an invoice that will be sent to your patient</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
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
              name="appointmentId"
              render={({ field }) => {
                const patientId = form.watch('patientId');
                
                // Use selectedPatientId instead of patientId for consistent state
                useEffect(() => {
                  setSelectedPatientId(patientId);
                }, [patientId]);
                return (
                  <FormItem>
                    <FormLabel>Appointment</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!patientId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !patientId 
                              ? "Please select a patient first" 
                              : "Select an appointment"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patientId && patientDict[patientId]?.appointments.map((appointment) => (
                          <SelectItem key={appointment.id} value={appointment.id!}>
                            {`${new Date(appointment.scheduledAt).toLocaleString()} ${
                              appointment.status === 'Completed' ? '(Completed)' : ''
                            }`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Create Invoice"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}