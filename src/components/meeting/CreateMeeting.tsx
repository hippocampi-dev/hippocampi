"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"

// Mock patient data (replace with actual data fetching in a real application)
const patients = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Alice Johnson" },
]

const createMeetingSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient.",
  }),
})

export default function CreateMeeting() {
  const [meetingUrl, setMeetingUrl] = useState("")
  const [createdMeetingId, setCreatedMeetingId] = useState("")

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
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create Meeting</Button>
          </form>
        </Form>
        {meetingUrl && (
          <div className="mt-4">
            <p className="text-sm mb-2">Meeting ID: {createdMeetingId}</p>
            <Button variant="outline" className="w-full" onClick={() => window.open(meetingUrl, "_blank")}>
              Join Created Meeting
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}