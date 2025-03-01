"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { PatientDict, PatientsInterface } from "~/server/db/type"

const createMeetingSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient.",
  }),
  appointmentId: z.string({
    required_error: "Please select the appropriate meeting"
  })
})

interface props {
  patients: PatientsInterface[]
  patientDict: PatientDict
}

export default function CreateMeeting({ patients, patientDict }: props) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [createdMeetingId, setCreatedMeetingId] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const form = useForm<z.infer<typeof createMeetingSchema>>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      patientId: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof createMeetingSchema>) => {
    if (meetingUrl !== '') return;

    try {
      const response = await fetch("/api/zoom/create-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      setMeetingUrl(data.join_url);
      setCreatedMeetingId(data.id);
    } catch (error) {
      console.error("Error creating meeting:", error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create a Zoom Meeting</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Patient</FormLabel>
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
            /><FormField
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
            
            <Button type="submit">Create Meeting</Button>
          </form>
        </Form>
        {meetingUrl && (
          <div className="mt-4">
            {/* <p className="text-sm mb-2">Meeting ID: {createdMeetingId}</p> */}
            <p className="text-sm mb-2">Meeting Link: {meetingUrl}</p>
            <Button variant="outline" className="w-full" onClick={() => window.open(meetingUrl, "_blank")}>
              Join Created Meeting
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}