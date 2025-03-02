import { z } from "zod"

// Zod schema for step 1 – Personal Information
export const validatePastDate = (val: string) => {
    const d = new Date(val);
    const today = new Date();
    return d <= today;
  };

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middle_initial: z.string().max(1).optional(),
  condition: z.string().nonempty("Condition is required"),
  dateOfBirth: z
    .string()
    .nonempty("Date of birth is required")
    .refine(
      (val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) return false;
        if (!validatePastDate(val)) return false;
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const m = today.getMonth() - date.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
          age--;
        }
        return age >= 18 && age <= 130;
      },
      { message: "You must be older than 18 and your birth date cannot be in the future" }
    ),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  primaryLanguage: z.string().min(1, "Primary language is required"),
  phoneNumber: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required").max(10, "ZIP code must be at most 10 characters"),
  termsOfService: z.boolean().refine(val => val, { message: "You must agree to the Terms of Service" }),
  hipaaCompliance: z.boolean().refine(val => val, { message: "You must confirm HIPAA compliance" }),
});

export type PersonalInfoSchemaType = z.infer<typeof personalInfoSchema>

export const patientSchema = z.object({
  patientId: z.string().uuid(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middle_initial: z.string().max(1, "Middle initial must be at most one character").optional(),
  condition: z.string().optional(),
  dateOfBirth: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg);
    }
  }, z.date({ required_error: "Date of birth is required" })),
  age: z.number(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  primaryLanguage: z.string().min(1, "Primary language is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"),
  email: z.string().email("Invalid email"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required").max(10, "ZIP code must be at most 10 characters"),
  hipaaCompliance: z.boolean(),
  stripeCustomerId: z.string().optional().nullable(),
  // Optional timestamps – if you want to validate these too:
  created_at: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().optional()
  ),
  updated_at: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().optional()
  ),
});

export type PatientSchemaType = z.infer<typeof patientSchema>;