import { users, userLogins } from "./schema/auth";
import { doctorCredentials, doctors } from "./schema/doctor";
import {
  patientDoctorManagement,
  appointments,
  userRoles,
  doctorSubcriptions,
} from "./schema/management";
import {
  allergies,
  cognitiveSymptoms,
  diagnoses,
  emergencyContacts,
  medicalHistory,
  medications,
  patients,
  treatments,
} from "./schema/patient";

// User ID
export type UserIdInterface = typeof users.id.dataType;

// Users
export type UserInterface = typeof users.$inferInsert;

// User Roles
export type UserRolesInterface = typeof userRoles.$inferInsert;

// Role types (strings)
export enum role {
  patient = "patient",
  doctor = "doctor",
  admin = "admin",
}

export enum gender {
  "male",
  "female",
  "non_binary",
  "other",
  "prefer_not_to_say"
};

// Doctors
export type DoctorsInterface = typeof doctors.$inferInsert;

// Specialization
export enum specialization {
  Oncology = "Oncology"
}

// Doctor Credentials
export type DoctorCredentialsInterface = typeof doctorCredentials.$inferInsert;

// Patients
export type PatientsInterface = typeof patients.$inferInsert;

// Caregivers
// export type PatientCaregiversInterface = typeof caregiverInfo.$inferInsert;

// Patient-Doctor Management
export type PatientDoctorManagementInterface =
  typeof patientDoctorManagement.$inferInsert;

// Scheduled Meetings
export type AppointmentsInterface = typeof appointments.$inferInsert;

// Scheduled Meetings Id
export type AppointmentsIdInterface = typeof appointments.id.dataType;

// User Logins
export type UserLoginsInterface = typeof userLogins.$inferInsert;

// Emergency Contacts
export type PatientEmergencyContactsInterface = typeof emergencyContacts.$inferInsert;

// Medications
export type PatientMedicationsInterface = typeof medications.$inferInsert;

// Allergies
export type PatientAllergiesInterface = typeof allergies.$inferInsert;

// Diagnoses
export type PatientDiagnosesInterface = typeof diagnoses.$inferInsert;

// Treatments
export type PatientTreatmentsInterface = typeof treatments.$inferInsert;

// Medical History
export type PatientMedicalHistoryInterface = typeof medicalHistory.$inferInsert;

// Cognitive Symptoms
export type PatientCognitiveSymptomsInterface =
  typeof cognitiveSymptoms.$inferInsert;

// Patient Information
export interface PatientHealthInformationInterface {
  medicalHistory: PatientMedicalHistoryInterface
  allergies: PatientAllergiesInterface[];
  cognitiveSymptoms: PatientCognitiveSymptomsInterface[];
  dianoses: PatientDiagnosesInterface[];
  emergencyContacts: PatientEmergencyContactsInterface[];
  medications: PatientMedicationsInterface[];
  treatments: PatientTreatmentsInterface[];
}

// doctor subscription
export type DoctorSubscriptionsInterface = typeof doctorSubcriptions.$inferInsert;