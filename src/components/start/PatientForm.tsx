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
import { PatientsInterface, SubscriptionsInterface } from "~/server/db/type";
import { cognitiveSymptoms } from "~/server/db/schema/patient";
import { personalInfoSchema, validatePastDate } from "~/lib/schemas/patients";
import { calculateAge } from "~/utilities/calculateAge";

// Helper function to format Zod errors
const formatZodErrors = (issues: z.ZodIssue[]): string =>
  issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("\n");

// Zod schema for step 1 – Personal Information


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
  severityLevel: z.enum(["mild", "moderate", "severe", "undefined"]).optional(),
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
  cognitiveSymptoms: z.array(cognitiveSymptomSchema).optional(),
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
    cognitiveSymptoms: [],
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
    const parsedMedicalInfo: MedicalInfo = {
      ...medParse.data,
      medications: medParse.data.medications || [],
      allergies: medParse.data.allergies || [],
      cognitiveSymptoms: medParse.data.cognitiveSymptoms || [],
    };
    setError(null);
    if (!session) {
      console.error("Session is null");
      return;
    }

    // Convert dateOfBirth to Date and calculate age
    const parsedDOB = new Date(basicParse.data.dateOfBirth);
    const calculatedAge = calculateAge(parsedDOB);

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
      
      const patientId = session.user.id; 
      // assume API returns the new patient's id
  
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
      if (medicalInfo.cognitiveSymptoms && medicalInfo.cognitiveSymptoms.length > 0) {
        console.log(medicalInfo.cognitiveSymptoms)
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
        const medsRes = await fetch("/api/db/patient/health-info/medications/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId, medications: medicalInfo.medications }),
        });
        if (!medsRes.ok) throw new Error("Failed to add medications");
      }

      // 6. Post subscription
      // const subscription: SubscriptionsInterface = {
      //   userId: session.user.id,
      // }
      // const subscriptionRes = await fetch('/api/db/management/subscription/add', {
      //   method: 'POST',
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(subscription)
      // });
      // if (!subscriptionRes.ok) throw new Error("Failed to add subscriptions");
  
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
              <PersonalInfoForm data={{ ...personalInfo, middle_initial: personalInfo.middle_initial || "" }} onChange={(data) => setPersonalInfo(prev => ({ ...prev, ...data }))} />
            )}
            {step === 2 && (
              <MedicalInfoForm data={{
                medications: medicalInfo.medications ?? [],
                allergies: medicalInfo.allergies ?? [],
                diagnosis: medicalInfo.diagnosis, // diagnosis can remain optional if desired
                cognitiveSymptoms: medicalInfo.cognitiveSymptoms ?? []
              }} onChange={setMedicalInfo} />
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
