"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import type { InvoicesInterface, PatientsInterface } from "~/server/db/type"
import { useSession } from "next-auth/react"

const invoiceFormSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  hourlyRate: z
    .string()
    .min(1, "Hourly rate is required")
    .pipe(z.coerce.number({ invalid_type_error: "Hourly rate must be a number" }).positive()),
  duration: z
    .string()
    .min(1, "Meeting duration is required")
    .pipe(z.coerce.number({ invalid_type_error: "Meeting duration must be a number" }).positive()),
  notes: z.string().min(10, { message: "Notes must be at least 10 characters" }).max(500, {
    message: "Notes must not exceed 500 characters.",
  }),
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

interface Props {
  patients: PatientsInterface[]
}

export default function InvoiceForm({ patients }: Props) {
  const { data: session } = useSession()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      patientId: "",
      hourlyRate: 0,
      duration: 0,
      notes: "",
    },
  })

  async function onSubmit(data: InvoiceFormValues) {
    setIsSaving(true)
    try {
      const invoice: InvoicesInterface = {
        hourlyRate: data.hourlyRate.toString(),
        duration: data.duration,
        status: "unpaid",
        patientId: data.patientId,
        doctorId: session?.user.id!,
        total: ((data.hourlyRate * data.duration) / 60).toFixed(2), // Calculate total
        notes: data.notes,
      }

      const response = await fetch("/api/db/management/invoice/add", {
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" inputMode="decimal" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Minutes)</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" inputMode="numeric" />
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
                    Please include the time and date of the meeting as well as any relevant notes.
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