"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import PersonalInfoForm from "./PersonalInfoForm";
import MedicalInfoForm from "./MedicalInfoForm";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PatientsInterface } from "~/server/db/type";

// Helper function to format Zod errors
const formatZodErrors = (issues: z.ZodIssue[]): string =>
  issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("\n");

// Zod schema for step 1 – Personal Information
const validatePastDate = (val: string) => {
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

// Zod schema for diagnosis
export const diagnosisSchema = z.object({
  conditionName: z.string().min(1, "Condition name is required"),
  diagnosisDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || validatePastDate(val),
      { message: "Diagnosis date cannot be in the future" }
    ),
  selfReported: z.boolean().default(false),
  notes: z.string().optional(),
});

// Zod schema for cognitive symptoms
export const cognitiveSymptomSchema = z.object({
  symptomType: z.string().min(1, "Symptom type is required"),
  onsetDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || validatePastDate(val),
      { message: "Onset date cannot be in the future" }
    ),
  severityLevel: z.enum(["mild", "moderate", "severe"]).optional(),
  notes: z.string().optional(),
});

// Zod schema for step 2 – Medical Information
export const medicationSchema = z.object({
  medicationName: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.enum(["daily", "weekly", "monthly", "as_needed"]),
  start_date: z
    .string()
    .optional()
    .refine(
      (val) => !val || validatePastDate(val),
      { message: "Start date cannot be in the future" }
    ),
  end_date: z
    .string()
    .optional(),
});
export const allergySchema = z.object({
  allergen: z.string().min(1, "Allergen is required"),
  reaction: z.string().optional(),
  severity: z.enum(["mild", "moderate", "severe"]),
});
export const medicalInfoSchema = z.object({
  medications: z.array(medicationSchema).optional(),
  allergies: z.array(allergySchema).optional(),
  diagnosis: diagnosisSchema.optional(),
  cognitiveSymptoms: cognitiveSymptomSchema.optional(),
});

// TypeScript types inferred from the schemas
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type MedicalInfo = z.infer<typeof medicalInfoSchema>;

export default function PatientForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    middle_initial: "",
    condition: "",
    dateOfBirth: "",
    gender: "male",
    primaryLanguage: "",
    phoneNumber: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    termsOfService: false,
    hipaaCompliance: false
  });
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    medications: [],
    allergies: [],
    diagnosis: undefined,
    cognitiveSymptoms: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  // Validate personal info on Next
  const handleNext = () => {
    const result = personalInfoSchema.safeParse(personalInfo);
    if (!result.success) {
      setError(formatZodErrors(result.error.errors));
      return;
    }
    setError(null);
    setStep(2);
  };

  // Validate both personal and medical info on Submit, then post the data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const basicParse = personalInfoSchema.safeParse(personalInfo);
    if (!basicParse.success) {
      setError(formatZodErrors(basicParse.error.errors));
      return;
    }
    const medParse = medicalInfoSchema.safeParse(medicalInfo);
    if (!medParse.success) {
      setError(formatZodErrors(medParse.error.errors));
      return;
    }
    setError(null);
    if (!session) {
      console.error("Session is null");
      return;
    }

    // Convert dateOfBirth to Date and calculate age
    const parsedDOB = new Date(basicParse.data.dateOfBirth);
    let calculatedAge = new Date().getFullYear() - parsedDOB.getFullYear();
    const monthDiff = new Date().getMonth() - parsedDOB.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < parsedDOB.getDate())) {
      calculatedAge--;
    }

    // Create the patient object ensuring proper types
    const patient: PatientsInterface = {
      patientId: session.user.id,
      age: calculatedAge,
      firstName: basicParse.data.firstName,
      lastName: basicParse.data.lastName,
      middle_initial: basicParse.data.middle_initial,
      condition: basicParse.data.condition,
      dateOfBirth: parsedDOB,
      gender: basicParse.data.gender,
      primaryLanguage: basicParse.data.primaryLanguage,
      phoneNumber: basicParse.data.phoneNumber,
      email: basicParse.data.email,
      streetAddress: basicParse.data.streetAddress,
      city: basicParse.data.city,
      state: basicParse.data.state,
      zipCode: basicParse.data.zipCode,
      hipaaCompliance: basicParse.data.hipaaCompliance,
    };

    try {
      // 1. Post basic patient info
      const patientRes = await fetch("/api/db/patient/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });
      if (!patientRes.ok) throw new Error("Failed to add patient basic info");
      
      const patientId = session.user.id; // assume API returns the new patient's id
  
      // 2. Post allergies if provided
      if (medicalInfo.allergies && medicalInfo.allergies.length > 0) {
        const allergyRes = await fetch("/api/db/patient/health-info/allergies/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId, allergies: medicalInfo.allergies }),
        });
        if (!allergyRes.ok) throw new Error("Failed to add allergies");
      }
  
      // 3. Post cognitive symptoms if provided
      if (medicalInfo.cognitiveSymptoms) {
        const cogRes = await fetch("/api/db/patient/health-info/cognitive-symptoms/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId, cognitiveSymptoms: medicalInfo.cognitiveSymptoms }),
        });
        if (!cogRes.ok) throw new Error("Failed to add cognitive symptoms");
      }
  
      // 4. Post diagnosis if provided
      if (medicalInfo.diagnosis) {
        const diagRes = await fetch("/api/db/patient/health-info/diagnoses/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId, diagnosis: medicalInfo.diagnosis }),
        });
        if (!diagRes.ok) throw new Error("Failed to add diagnosis");
      }
  
      // 5. Post medications if provided
      if (medicalInfo.medications && medicalInfo.medications.length > 0) {
        console.log(patientId)
        const medsRes = await fetch("/api/db/patient/health-info/medications/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId, medications: medicalInfo.medications }),
        });
        if (!medsRes.ok) throw new Error("Failed to add medications");
      }
  
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Signup failed.");
    }
  };

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Patient Registration
        </CardTitle>
        <div className="flex justify-center space-x-2 mt-4">
          <div className={`h-2 w-16 rounded-full ${step === 1 ? "bg-black" : "bg-gray-200"}`} />
          <div className={`h-2 w-16 rounded-full ${step === 2 ? "bg-black" : "bg-gray-200"}`} />
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <PersonalInfoForm data={personalInfo} onChange={setPersonalInfo} />
            )}
            {step === 2 && (
              <MedicalInfoForm data={medicalInfo} onChange={setMedicalInfo} />
            )}
          </motion.div>
        </AnimatePresence>
        {error && <p className="mt-4 text-center text-red-500 whitespace-pre-wrap">{error}</p>}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button onClick={() => setStep(step - 1)} variant="outline">
              Previous
            </Button>
          )}
          {step < 2 ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Submit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
