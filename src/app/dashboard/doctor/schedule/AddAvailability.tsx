"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import type { z } from "zod"
import { availabilitySchema } from "~/lib/utils"

// Create time options array
const timeArray = Array.from({ length: 96 }).map((_, i) => {
  const hour = Math.floor(i / 4)
    .toString()
    .padStart(2, "0")
  const minute = ((i % 4) * 15).toString().padStart(2, "0")
  return {
    value: `${hour}:${minute}`,
    label: `${hour}:${minute}`,
  }
})

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


type FormValues = z.infer<typeof availabilitySchema>

export function AddAvailability() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [close, setClose] = useState(false)
  // Initialize React Hook Form with Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      day: undefined,
      "start-time": undefined,
      "end-time": undefined,
    },
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
  
    try {
      const response = await fetch('/api/db/doctor/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  
      const result = await response.json()
  
      if (result.errors) {
        // Handle validation errors from server
        toast("Validation Error", {
          description: result.message,
        })
        // Set server-side errors in the form
        Object.entries(result.errors).forEach(([key, value]) => {
          form.setError(key as keyof FormValues, {
            type: "server",
            message: Array.isArray(value) ? value[0] : (value as string),
          })
        })
      } else if (result.error) {
        // Handle server error
        toast("Error", {
          description: result.error,
        })
      } else {
        // Handle success
        toast.success(result.message)
        if (close) {
          setOpen(false)
        } else {
          setOpen(true)
        }
      }
    } catch (error) {
      toast("Error", {
        description: "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         <Button variant="outline">Add Availability</Button>
       </DialogTrigger>
       <DialogContent className="flex flex-col">
       <DialogHeader>
           <DialogTitle>Add Availability</DialogTitle>
         </DialogHeader>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)}>
           <div className="grid gap-4 py-4">
               {/* Day Selection */}
               <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Select Day</FormLabel>
                    <div className="col-span-3">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Day of the Week</SelectLabel>
                            {DAYS.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Time Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Time</FormLabel>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                  {/* Start Time */}
                  <FormField
                    control={form.control}
                    name="start-time"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className="h-60">
                              <SelectGroup>
                                <SelectLabel>Select Time</SelectLabel>
                                {timeArray.map((time) => (
                                  <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* End Time */}
                  <FormField
                    control={form.control}
                    name="end-time"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="End Time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className="h-60">
                              <SelectGroup>
                                <SelectLabel>Select Time</SelectLabel>
                                {timeArray.map((time) => (
                                  <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" onClick={()=>setClose(true)} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add and Close"}
              </Button>
              <Button type="submit" onClick={()=>setClose(false)} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add availability"}
              </Button>
            </DialogFooter>
           </form> 
        </Form>
       </DialogContent>
    </Dialog>
  )
}

