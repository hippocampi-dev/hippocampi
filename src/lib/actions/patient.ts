import { PatientAllergiesInterface, PatientCognitiveSymptomsInterface, PatientDiagnosesInterface, PatientEmergencyContactsInterface, PatientMedicationsInterface, PatientTreatmentsInterface } from "~/server/db/type";

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
      hipaaCompliance: boolean;
    };
    emergencyContacts: PatientEmergencyContactsInterface[];
    treatments: PatientTreatmentsInterface[];
    medications: PatientMedicationsInterface[];
    allergies: PatientAllergiesInterface[];
    diagnoses: PatientDiagnosesInterface[];
    cognitiveSymptoms: PatientCognitiveSymptomsInterface[];
  }
  