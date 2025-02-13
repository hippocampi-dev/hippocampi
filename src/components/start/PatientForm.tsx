"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import PersonalInfoForm from "./PersonalInfoForm";
import MedicalInfoForm from "./MedicalInfoForm";
import { z } from "zod";

// Zod schema for step 1 – Personal Information
const personalInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_initial: z.string().max(1).optional(),
  date_of_birth: z.string().nonempty("Date of birth is required"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  primary_language: z.string().min(1, "Primary language is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email"),
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "ZIP code is required"),
});

// Zod schema for step 2 – Medical Information
const medicationSchema = z.object({
  medication_name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.enum(["daily", "weekly", "monthly", "as_needed"]),
  start_date: z.string().nonempty("Start date is required"),
  end_date: z.string().optional(),
});
const allergySchema = z.object({
  allergen: z.string().min(1, "Allergen is required"),
  reaction: z.string().optional(),
  severity: z.enum(["mild", "moderate", "severe"]),
});
const medicalInfoSchema = z.object({
  medications: z.array(medicationSchema).optional(),
  allergies: z.array(allergySchema).optional(),
  diagnoses: z.string().optional(),
  cognitive_symptoms: z.string().optional(),
});

// TypeScript types inferred from the schemas
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type MedicalInfo = z.infer<typeof medicalInfoSchema>;

export default function PatientForm() {
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    first_name: "",
    last_name: "",
    middle_initial: "",
    date_of_birth: "",
    gender: "male",
    primary_language: "",
    phone_number: "",
    email: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
  });
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    medications: [],
    allergies: [],
    diagnoses: "",
    cognitive_symptoms: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Validate personal info on next
  const handleNext = () => {
    const result = personalInfoSchema.safeParse(personalInfo);
    if (!result.success) {
      setError("Please fill out all required personal information correctly.");
      return;
    }
    setError(null);
    setStep(2);
  };

  // Validate medical info on submit and then POST the data
  const handleSubmit = async () => {
    const result = medicalInfoSchema.safeParse(medicalInfo);
    if (!result.success) {
      setError("Please check your medical information entries.");
      return;
    }
    setError(null);
    const payload = { ...personalInfo, ...medicalInfo, role: "patient" };
    try {
      const res = await fetch("/api/patients/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Signup failed");
      }
      console.log("Signup successful!");
      // Optionally, redirect the user here (e.g., using next/navigation)
    } catch (err: any) {
      setError(err.message || "Signup failed.");
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
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
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
