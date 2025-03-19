"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Create time options array with AM/PM format
const timeArray = Array.from({ length: 96 }).map((_, i) => {
  const totalMinutes = i * 15;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  
  // Create 24-hour format for value
  const value = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  
  // Create 12-hour format for display with special handling for 12 AM and 12 PM
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12; // Convert 0 to 12 for display
  const period = hour >= 12 ? "PM" : "AM";
  
  // Custom labels for noon and midnight for clarity
  let label = `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  if (hour === 0 && minute === 0) label += " (Midnight)";
  if (hour === 12 && minute === 0) label += " (Noon)";
  
  return {
    value,
    label,
    isNoon: hour === 12 && minute === 0,
  }
})

// Use noon (12:00 PM) as the default time value
const noonTimeValue = "12:00";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

type FormValues = z.infer<typeof availabilitySchema>

export function AddAvailability() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [close, setClose] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [lastSubmittedValues, setLastSubmittedValues] = useState<FormValues | null>(null)
  const router = useRouter()
  
  // Initialize React Hook Form with Zod resolver and default values preset to noon
  const form = useForm<FormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      day: undefined,
      "start-time": noonTimeValue, // Set default start time to noon
      "end-time": "13:00",         // Set default end time to 1:00 PM
    },
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormError(null)
    } else if (lastSubmittedValues) {
      form.reset(lastSubmittedValues)
    } else {
      // If opening for the first time with no submitted values,
      // make sure the noon default is set
      form.reset({
        day: undefined,
        "start-time": noonTimeValue,
        "end-time": "13:00",
      })
    }
  }, [open, form, lastSubmittedValues])

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setFormError(null)
    
    // Check that end time is after start time
    const startTime = data["start-time"]
    const endTime = data["end-time"]
    
    if (startTime && endTime) {
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)
      
      if (startHour == null || startMinute == null) {
        form.setError("start-time", {
          type: "manual",
          message: "Invalid start time format",
        })
        setIsSubmitting(false)
        return
      }
      if (endHour == null || endMinute == null) {
        form.setError("end-time", {
          type: "manual",
          message: "Invalid end time format",
        })
        setIsSubmitting(false)
        return
      }
      const startTotalMinutes = startHour * 60 + startMinute
      const endTotalMinutes = endHour * 60 + endMinute
      
      if (startTotalMinutes >= endTotalMinutes) {
        form.setError("end-time", {
          type: "manual",
          message: "End time must be after start time",
        })
        setFormError("End time must be after start time")
        setIsSubmitting(false)
        return
      }
    }
  
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
        toast.error("Validation Error", {
          description: result.message,
        })
        
        // Set server-side errors in the form
        Object.entries(result.errors).forEach(([key, value]) => {
          const errorMessage = Array.isArray(value) ? value[0] : (value as string)
          form.setError(key as keyof FormValues, {
            type: "server",
            message: errorMessage,
          })
          
          // Set the overlap error message to display prominently
          if (key === "time") {
            setFormError(errorMessage)
          }
        })
        
        // Set general error if there's an error message but no specific field errors
        if (result.error && !Object.keys(result.errors).length) {
          setFormError(result.error)
        }
      } else if (result.error) {
        // Handle server error
        toast.error("Error", {
          description: result.error,
        })
        setFormError(result.error)
      } else {
        // Handle success
        toast.success(result.message)
        
        // Save the successfully submitted values
        setLastSubmittedValues(data)
        
        // Revalidate the current route to refresh the data
        router.refresh()
        
        if (close) {
          setOpen(false)
        } else {
          // Don't reset the form after successful submission 
          // if staying on the dialog - values will remain as is
          setFormError(null)
        }
      }
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
      setFormError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler for dialog trigger button
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && !lastSubmittedValues) {
      // Reset to default values when opening
      form.reset({
        day: undefined,
        "start-time": noonTimeValue,
        "end-time": "13:00",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
         <Button variant="outline">Add Availability</Button>
       </DialogTrigger>
       <DialogContent className="flex flex-col">
       <DialogHeader>
           <DialogTitle>Add Availability</DialogTitle>
         </DialogHeader>
         
         {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-red-600">{formError}</AlertDescription>
          </Alert>
         )}
         
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
                      <FormMessage className="text-red-600 font-medium" />
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
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={noonTimeValue}
                        >
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
                                  <SelectItem 
                                    key={time.value} 
                                    value={time.value}
                                    className={time.isNoon ? "bg-accent/50 font-medium" : ""}
                                  >
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-600 font-medium" />
                      </FormItem>
                    )}
                  />

                  {/* End Time */}
                  <FormField
                    control={form.control}
                    name="end-time"
                    render={({ field }) => (
                      <FormItem>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value} 
                          defaultValue="13:00"
                        >
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
                                  <SelectItem 
                                    key={time.value} 
                                    value={time.value}
                                    className={time.value === "13:00" ? "bg-accent/50 font-medium" : ""}
                                  >
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-600 font-medium" />
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

