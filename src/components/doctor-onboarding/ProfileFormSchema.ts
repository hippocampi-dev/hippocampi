import { z } from "zod"

// Define the gender enum to match your database schema
export const GenderEnum = z.enum(["male", "female", "other", "prefer-not-to-say"])

const GENDER_VALUES = ["male", "female", "other", "prefer-not-to-say"] as const
export type GenderValue = typeof GENDER_VALUES[number]

export function convertGender(input: string): GenderValue {
  if (input === GENDER_VALUES['0']) {
    return GENDER_VALUES['0']
  }
  else if (input === GENDER_VALUES['1']) {
    return GENDER_VALUES['1']
  }
  else if (input === GENDER_VALUES['2']) {
    return GENDER_VALUES['2']
  }
  else if (input === GENDER_VALUES['3']) {
    return GENDER_VALUES['3']
  }
  else {
    throw new Error(
      `Invalid gender value: "${input}". Must be one of: ${GENDER_VALUES.join(", ")}`
    )
  }
}

// Define the onboarding status enum to match your database schema
export const OnboardingStatusEnum = z.enum([
  'not-started',
  'profile',
  'credentials',
  'pending',
  'approved'
])

// Doctor's basic information schema
export const DoctorProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  // Age will be calculated from date of birth
  gender: GenderEnum,
  primaryLanguage: z.string().min(1, "Primary language is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  specialization: z.string().optional(),
  bio: z.string().min(1, "Bio is required"),
  profileUrl: z.string().min(1, "Profile Url is required")
  // Onboarding status will be managed by the system
})

// Doctor's credentials schema
export const DoctorCredentialsSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  medicalSchool: z.string().min(1, "Medical school is required"),
  residency: z.string().min(1, "Residency is required"),
  approach: z.string().min(1, "Approach is required"),
})

// Combined schema for the profile information form
export const ProfileFormSchema = z.object({
  profile: DoctorProfileSchema,
  credentials: DoctorCredentialsSchema,
})

// Type definitions based on the schemas
export type DoctorProfile = z.infer<typeof DoctorProfileSchema>
export type DoctorCredentials = z.infer<typeof DoctorCredentialsSchema>
export type ProfileFormData = z.infer<typeof ProfileFormSchema>