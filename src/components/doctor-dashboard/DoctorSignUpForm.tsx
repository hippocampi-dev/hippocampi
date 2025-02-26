"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { DoctorCredentialsInterface, DoctorsInterface, SubscriptionsInterface } from "~/server/db/type"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  specialization: z.string().min(2, { message: "Specialization must be at least 2 characters." }),
  degree: z.string().min(2, { message: "Degree must be at least 2 characters." }),
  medicalSchool: z.string().min(2, { message: "Medical school must be at least 2 characters." }),
  residency: z.string().min(2, { message: "Residency must be at least 2 characters." }),
  medicalApproach: z.string().min(10, { message: "Medical approach must be at least 10 characters." }),
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters' }).max(500, {
    message: "Bio must not exceed 500 characters.",
  }),
})

export const specializations = [
  "General Practice",
  "Internal Medicine",
  "Pediatrics",
  "Obstetrics and Gynecology",
  "Surgery",
  "Psychiatry",
  "Dermatology",
  "Cardiology",
  "Neurology",
  "Oncology",
  "Other",
] as const

export default function DoctorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      specialization: "",
      degree: "",
      medicalSchool: "",
      residency: "",
      medicalApproach: "",
      bio: ""
    },
  })
  
  const makeApiCall = async (values: z.infer<typeof formSchema>) => {
    if (!session) {
      console.error("Session is null");
      return;
    }

    const doctor: DoctorsInterface = {
      doctorId: session.user.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      location: values.location,
      specialization: values.specialization,
      bio: values.bio
    }

    const credentials: DoctorCredentialsInterface = {
      doctorId: session.user.id,
      degree: values.degree,
      medicalSchool: values.medicalSchool,
      residency: values.residency,
      approach: values.medicalApproach
    }

    const subscription: SubscriptionsInterface = {
      userId: session.user.id,
    }

    // doctor
    try {
      const response = await fetch('/api/db/doctor/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctor)
      })
      
      const result = await response.json();
    } catch (error) {
      console.error('Error adding doctor:', error)
      throw new Error('Error adding doctor');
    }

    // credentials
    try {
      const response = await fetch('/api/db/doctor/credentials/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      
      const result = await response.json();
    } catch (error) {
      console.error('Error adding doctor credentials:', error)
      throw new Error('Error adding doctor credentials');
    }
    
    // set up subscriptions in db
    try {
      const response = await fetch('/api/db/management/subscription/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })
      
      const result = await response.json();
    } catch (error) {
      console.error('Error setting up subscription:', error)
      throw new Error('Error adding subscription');
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log('submitting');

    // api call
    await makeApiCall(values).then(redirect('/dashboard/doctor'));

    setIsSubmitting(false)
    form.reset()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Doctor Information Form</CardTitle>
        <CardDescription>Please fill out your professional information below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="New York, NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a specialization" />
                      </SelectTrigger>
                    </FormControl>
                      <SelectContent>
                        {specializations.map((specialization) => (
                          <SelectItem key={specialization} value={specialization}>
                            {specialization}
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
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="MD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalSchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical School</FormLabel>
                  <FormControl>
                    <Input placeholder="Harvard Medical School" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="residency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residency</FormLabel>
                  <FormControl>
                    <Input placeholder="Mayo Clinic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalApproach"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Approach</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe your medical approach and philosophy..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

