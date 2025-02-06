import { relations } from "drizzle-orm";
import { accounts, sessions, userLogins, users } from "./auth";
import { doctors } from "./doctor";
import { allergies, cognitiveSymptoms, diagnoses, emergencyContacts, patients } from "./patient";
import { patientDoctorManagement, scheduledMeetings, userRoles } from "./management";


export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  doctors: one(doctors),
  patients: one(patients),
  user_roles: one(userRoles),
  user_logins: many(userLogins)
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users,{
    fields: [accounts.userId],
    references: [users.id]
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  }),
}));

export const userLoginsRelations = relations(userLogins, ({ one }) => ({
  user: one(users, {
    fields: [userLogins.userId],
    references: [users.id]
  }),
  patient: one(patients, {
    fields: [userLogins.affectedPatientId],
    references: [patients.patientId]
  }),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, { 
    fields: [doctors.doctorId], 
    references: [users.id],
  }),
  patient_doctor_management: many(patientDoctorManagement),
  scheduled_meetings: many(scheduledMeetings)
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id]
  }),
}));

export const patientDoctorManagementRelations = relations(patientDoctorManagement, ({ many }) => ({
  doctor: many(doctors),
  patient: many(patients)
}));

export const scheduledMeetingsRelations = relations(scheduledMeetings, ({ one }) => ({
  doctor: one(doctors, {
    fields: [scheduledMeetings.doctorId],
    references: [doctors.doctorId]
  }),
  patient: one(patients, {
    fields: [scheduledMeetings.patientId],
    references: [patients.patientId]
  }),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, {
    fields: [patients.patientId, patients.email],
    references: [users.id, users.email]
  }),
  patient_doctor_management: many(patientDoctorManagement),
  scheduled_meetings: many(scheduledMeetings),
  emergency_contacts: one(emergencyContacts, {
    fields: [patients.patientId],
    references: [emergencyContacts.patientId]
  }),
  allergies: one(allergies, {
    fields: [patients.patientId],
    references: [allergies.patientId]
  }),
  diagnoses: one(diagnoses, {
    fields: [patients.patientId],
    references: [diagnoses.patientId]
  }),
  cognitive_symptoms: one(cognitiveSymptoms, {
    fields: [patients.patientId],
    references: [cognitiveSymptoms.patientId]
  })
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ many }) => ({
  patient: many(patients)
}));

export const medicationsRelations = relations(emergencyContacts, ({ many }) => ({
  patient: many(patients)
}));

export const allergiesRelations = relations(emergencyContacts, ({ many }) => ({
  patient: many(patients)
}));

export const diagnosesRelations = relations(emergencyContacts, ({ many }) => ({
  patient: many(patients)
}));

export const cognitiveSymptomsRelations = relations(emergencyContacts, ({ many }) => ({
  patient: many(patients)
}));