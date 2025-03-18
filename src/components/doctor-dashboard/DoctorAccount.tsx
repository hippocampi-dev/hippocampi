"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  CardFooter,
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
import { useSession } from "next-auth/react";
import { convertGender, ProfileFormData, ProfileFormSchema } from "../doctor-onboarding/ProfileFormSchema";
import { calculateAge } from "~/utilities/calculateAge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useToast } from "~/hooks/useToaster";

export default function DoctorAccount() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("personal")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [defaultValues, setDefaultValues] = useState<ProfileFormData>({
    profile: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "prefer-not-to-say",
      primaryLanguage: "English",
      phoneNumber: "",
      email: "",
      specialization: "",
      bio: "",
      profileUrl: ""
    },
    credentials: {
      degree: "",
      medicalSchool: "",
      residency: "",
      approach: "",
    },
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchDoctorInformation = async () => {
      try {
        setLoading(true);
        const doctorInfo: DoctorsInterface = await fetch("/api/db/doctor/get")
          .then((r) => r.json())
          .then((r) => r.response);
        const doctorCredentials: DoctorCredentialsInterface = await fetch(
          "/api/db/doctor/credentials/get",
        )
          .then((r) => r.json())
          .then((r) => r.response);

        if (doctorInfo && doctorCredentials) {
          const values: ProfileFormData = {
            profile: {
              firstName: doctorInfo.firstName,
              lastName: doctorInfo.lastName,
              email: doctorInfo.email,
              specialization: doctorInfo.specialization!,
              bio: doctorInfo.bio,
              profileUrl: doctorInfo.profileUrl,
              dateOfBirth: doctorInfo.dateOfBirth.toDateString(),
              gender: convertGender(doctorInfo.gender),
              // age
              primaryLanguage: doctorInfo.primaryLanguage,
              phoneNumber: doctorInfo.phoneNumber
            },
            credentials: {
              degree: doctorCredentials.degree,
              medicalSchool: doctorCredentials.medicalSchool,
              residency: doctorCredentials.residency,
              approach: doctorCredentials.approach,
            }
          };
          setDefaultValues(values);
          form.reset(values);
        }
      } catch (error) {
        console.error("Failed to fetch doctor information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorInformation();
  }, [form]);

  async function onSubmit(data: ProfileFormData) {
    setIsSaving(true);
    try {
      const doctor: DoctorsInterface = {
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        email: data.profile.email,
        bio: data.profile.bio,
        doctorId: session?.user.id!,
        specialization: data.profile.specialization,
        profileUrl: data.profile.profileUrl,
        dateOfBirth: new Date(data.profile.dateOfBirth),
        gender: data.profile.gender,
        age: calculateAge(new Date(data.profile.dateOfBirth)),
        primaryLanguage: data.profile.primaryLanguage,
        phoneNumber: data.profile.phoneNumber
      };

      const credentials: DoctorCredentialsInterface = {
        degree: data.credentials.degree,
        medicalSchool: data.credentials.medicalSchool,
        residency: data.credentials.residency,
        doctorId: session?.user.id!,
        approach: data.credentials.approach,
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

  if (loading) return <Loading />;

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Profile Information</h1>
          <p className="text-muted-foreground">Please provide your general information to complete your profile.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Profile</CardTitle>
            <CardDescription>
              This information will be used for your provider profile and communications.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal" className="relative">
                      Personal
                    </TabsTrigger>
                    <TabsTrigger value="professional" className="relative">
                      Professional
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="profile.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              First Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="profile.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Last Name <span className="text-red-500">*</span>
                            </FormLabel>
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
                      name="profile.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email Address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profile.phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Phone Number <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="profile.dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Date of Birth <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="profile.gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Gender <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non-binary">Non-binary</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="profile.primaryLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Primary Language <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>The main language you use for patient communication.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="professional" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="profile.specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Specialization <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your specialization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="neuropsychologist">Neuropsychology</SelectItem>
                              <SelectItem value="oncologist">Oncology</SelectItem>
                              <SelectItem value="speech-pathologist">Speech Pathology</SelectItem>
                              <SelectItem value="integrative-medical-physician">Integrative Medical Physician</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="credentials.degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Degree <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., MD, DO, MBBS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="credentials.medicalSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Medical School <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="credentials.residency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Residency <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="credentials.approach"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Clinical Approach <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your approach to patient care"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profile.bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Professional Biography <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of your professional background and areas of interest"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>This will be displayed on your public profile.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profile.profileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Profile Url <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (activeTab === "professional") {
                      setActiveTab("personal")
                    }
                  }}
                >
                  {activeTab === "personal" ? "Back" : "Previous"}
                </Button>

                {activeTab === "personal" ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      // Validate personal fields before proceeding
                      const personalFields = [
                        "profile.firstName",
                        "profile.lastName",
                        "profile.email",
                        "profile.phoneNumber",
                        "profile.dateOfBirth",
                        "profile.gender",
                        "profile.primaryLanguage",
                      ]

                      form.trigger(personalFields as any).then((isValid) => {
                        if (isValid) {
                          setActiveTab("professional")
                        } else {
                          toast({
                            title: "Validation Error",
                            description: "Please fix the errors before proceeding.",
                            variant: "destructive",
                          })
                        }
                      })
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {isSaving ? "Saving..." : "Save and Continue"}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
