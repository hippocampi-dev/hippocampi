"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { useToast } from "~/hooks/useToaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { ProfileFormSchema, type ProfileFormData } from '~/components/doctor-onboarding/ProfileFormSchema'
import { calculateAge } from "~/utilities/calculateAge"
import { addDoctorCredentialsOnboarding, addDoctorOnboarding, addDoctorSubscriptionOnboarding, updateDoctorOnboardingStatus } from "~/app/_actions/onboarding/actions"
import { DoctorCredentialsInterface, DoctorsInterface, SubscriptionsInterface } from "~/server/db/type"
import { useSession } from "next-auth/react"
import { isLocalHost } from "~/utilities/isLocalHost"

export default function ProfileInformation() {
  const {data: session} = useSession();
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")
  const [loading, setLoading] = useState(false)

  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      profile: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "prefer-not-to-say",
        primaryLanguage: "",
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
    },
  })

  const {
    formState: { errors },
  } = form

  // Check if a tab has errors
  const hasTabErrors = (tab: string) => {
    if (tab === "personal") {
      return (
        !!errors.profile?.firstName ||
        !!errors.profile?.lastName ||
        !!errors.profile?.dateOfBirth ||
        !!errors.profile?.gender ||
        !!errors.profile?.primaryLanguage ||
        !!errors.profile?.phoneNumber ||
        !!errors.profile?.email
      )
    } else if (tab === "professional") {
      return (
        !!errors.profile?.specialization ||
        !!errors.profile?.bio ||
        !!errors.credentials?.degree ||
        !!errors.credentials?.medicalSchool ||
        !!errors.credentials?.residency ||
        !!errors.credentials?.approach ||
        !!errors.profile?.profileUrl
      )
    }
    return false
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (activeTab === 'personal' || hasTabErrors("personal") || hasTabErrors("professional")) return;

    try {
      setLoading(true)

      // Calculate age from date of birth
      const age = calculateAge(new Date(data.profile.dateOfBirth));

      // Prepare the data for submission
      const doctorData: DoctorsInterface = {
        ...data.profile,
        doctorId: session?.user.id!,
        dateOfBirth: new Date(data.profile.dateOfBirth),
        age,
        onboardingStatus: "credentials"
      }

      const credentialsData: DoctorCredentialsInterface = {
        ...data.credentials,
        doctorId: session?.user.id!
      }

      const subscriptionData: SubscriptionsInterface = {
        userId: session?.user.id!,
        status: isLocalHost() ? 'subscribed' : 'unsubscribed'
      }

      // API call to save profile information
      // await addDoctorOnboarding(doctorData);
      // await addDoctorCredentialsOnboarding(credentialsData);
      // await addDoctorSubscriptionOnboarding(subscriptionData);

      toast({
        title: "Profile Information Saved",
        description: "Your profile information has been saved successfully.",
        variant: "success",
      })
      
      router.push("/onboarding/credentials")
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "There was an error saving your profile information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
                    if (activeTab === "personal") {
                      router.push("/onboarding/start")
                    } else if (activeTab === "professional") {
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
                    {loading ? "Saving..." : "Save and Continue"}
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