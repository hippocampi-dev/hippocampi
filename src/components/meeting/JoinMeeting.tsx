"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"

const joinMeetingSchema = z.object({
  meetingId: z.string().min(1, "Meeting ID is required."),
})

export default function JoinMeeting() {
  const form = useForm<z.infer<typeof joinMeetingSchema>>({
    resolver: zodResolver(joinMeetingSchema),
    defaultValues: {
      meetingId: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof joinMeetingSchema>) => {
    try {
      const response = await fetch("/api/zoom/join-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      window.open(data.join_url, "_blank")
    } catch (error) {
      console.error("Error joining meeting:", error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Join a Zoom Meeting</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="meetingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter meeting ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Join Meeting</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}