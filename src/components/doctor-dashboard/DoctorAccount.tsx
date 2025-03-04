"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Loading from "../loading/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DoctorCredentialsInterface, DoctorsInterface } from "~/server/db/type";
import { specializations } from "./DoctorSignUpForm";
import { useSession } from "next-auth/react";

const accountFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." }),
  specialization: z
    .string()
    .min(2, { message: "Specialization must be at least 2 characters." }),
  degree: z
    .string()
    .min(2, { message: "Degree must be at least 2 characters." }),
  medicalSchool: z
    .string()
    .min(2, { message: "Medical school must be at least 2 characters." }),
  residency: z
    .string()
    .min(2, { message: "Residency must be at least 2 characters." }),
  medicalApproach: z
    .string()
    .min(10, { message: "Medical approach must be at least 10 characters." }),
  bio: z
    .string()
    .min(50, { message: "Bio must be at least 50 characters" })
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    }),
  profileUrl: z.string().url()
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function DoctorAccount() {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<AccountFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    specialization: "",
    degree: "",
    medicalSchool: "",
    residency: "",
    medicalApproach: "",
    bio: "",
    profileUrl: "",
  });

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchDoctorInformation = async () => {
      try {
        setIsLoading(true);
        const doctorInfo: DoctorsInterface = await fetch("/api/db/doctor/get")
          .then((r) => r.json())
          .then((r) => r.response);
        const doctorCredentials: DoctorCredentialsInterface = await fetch(
          "/api/db/doctor/credentials/get",
        )
          .then((r) => r.json())
          .then((r) => r.response);

        if (doctorInfo && doctorCredentials) {
          const values: AccountFormValues = {
            firstName: doctorInfo.firstName || "",
            lastName: doctorInfo.lastName || "",
            email: doctorInfo.email || "",
            location: doctorInfo.location || "",
            specialization: doctorInfo.specialization || "",
            degree: doctorCredentials.degree || "",
            medicalSchool: doctorCredentials.medicalSchool || "",
            residency: doctorCredentials.residency || "",
            medicalApproach: doctorCredentials.approach || "",
            bio: doctorInfo.bio || "",
            profileUrl: doctorInfo.profileUrl || "",
          };
          setDefaultValues(values);
          form.reset(values);
        }
      } catch (error) {
        console.error("Failed to fetch doctor information:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorInformation();
  }, [form]);

  async function onSubmit(data: AccountFormValues) {
    setIsSaving(true);
    try {
      const doctor: DoctorsInterface = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        location: data.location,
        bio: data.bio,
        doctorId: session?.user.id!,
        specialization: data.specialization,
        profileUrl: data.profileUrl,
      };

      const credentials: DoctorCredentialsInterface = {
        degree: data.degree,
        medicalSchool: data.medicalSchool,
        residency: data.residency,
        doctorId: session?.user.id!,
        approach: data.medicalApproach,
      };

      // In a real application, you would send this data to your API
      await fetch("/api/db/doctor/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      });
      await fetch("/api/db/doctor/credentials/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      console.log("Account information updated successfully");
    } catch (error) {
      console.error("Failed to update account information:", error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your account information here.
          </CardDescription>
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                      <Input {...field} type="email" />
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
                      <Input {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a specialization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specializations.map((specialization) => (
                          <SelectItem
                            key={specialization}
                            value={specialization}
                          >
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Briefly describe your approach to patient care.
                    </FormDescription>
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Write a short bio about yourself (50-500 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
