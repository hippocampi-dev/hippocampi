"use server"

import { setPatient } from "~/server/db/queries";
import { PatientAllergiesInterface, PatientCognitiveSymptomsInterface, PatientDiagnosesInterface, PatientEmergencyContactsInterface, PatientMedicationsInterface, PatientsInterface, PatientTreatmentsInterface, UserIdInterface } from "~/server/db/type";
import { patientSchema, PatientSchemaType, PersonalInfoSchemaType } from "../schemas/patients";

interface PatientHealthInfo {
    patient: {
      patientId: string;
      firstName: string;
      lastName: string;
      middle_initial?: string;
      condition?: string;
      dateOfBirth: string;
      age: number;
      gender: string;
      primaryLanguage: string;
      phoneNumber: string;
      email: string;
      streetAddress: string;
      city: string;
      state: string;
      zipCode: string;
    };
    emergencyContacts: PatientEmergencyContactsInterface[];
    treatments: PatientTreatmentsInterface[];
    medications: PatientMedicationsInterface[];
    allergies: PatientAllergiesInterface[];
    diagnoses: PatientDiagnosesInterface[];
    cognitiveSymptoms: PatientCognitiveSymptomsInterface[];
  }
  

export async function updatePatientInfo(userIdString: UserIdInterface,
  patient: PatientSchemaType) {
  const validatedData = patientSchema.parse(patient);
  const data = await setPatient(userIdString, {
    ...validatedData,
    created_at: validatedData.created_at?.toISOString(),
    updated_at: validatedData.updated_at?.toISOString()
  });


  // If the update is successful, you might want to return the updated data
  return data
}

