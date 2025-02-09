import { relations, sql } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createTable } from "./schema";
import { users } from "./auth";
import { timestamps } from './utils'

// Enums for fixed-value fields
export const genderEnum = pgEnum("gender", [
  "male",
  "female",
  "non_binary",
  "other",
  "prefer_not_to_say"
]);

export const relationshipEnum = pgEnum("relationship", [
  "spouse",
  "child",
  "caregiver",
  "parent",
  "sibling",
  "friend",
  "other"
]);

export const medicationFrequencyEnum = pgEnum("frequency", [
  "daily",
  "weekly",
  "monthly",
  "as_needed",
  "prn"
]);

// Patients
export const patients = createTable('patients', {
  patientId: varchar("patient_id", { length: 255 })
    .notNull()
    .primaryKey()
    .references(() => users.id, {onDelete: 'cascade'}),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  middle_initial: varchar('middle_initial'),
  dateOfBirth: date("date_of_birth", { mode: "date" }).notNull(),
  gender: genderEnum("gender").notNull(),
  primaryLanguage: varchar('primary_language').notNull(),
  phoneNumber: varchar('phone_number').notNull(),
  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),
  streetAddress: text('street_address').notNull(),
  city: varchar('city').notNull(),
  state: varchar('state').notNull(),
  zipCode: varchar('zip_code').notNull(),
  ...timestamps
})

// Caregiver Info
export const caregivers = createTable('caregivers', {
  patientId: varchar('patient_id', { length: 255 })
    .notNull()
    .primaryKey()
    .references(() => users.id, {onDelete: 'cascade'}),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  patientRelation: varchar('patient_relation').notNull(),
  ...timestamps
})

// Emergency Contacts
export const emergencyContacts = createTable('emergency_contacts', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("patient_id", { length: 255 }).
    references(() => patients.patientId, {onDelete: 'cascade'})
    .notNull(),
  name: varchar('name').notNull(),
  relationship: relationshipEnum("relationship").notNull(),
  phoneNumber: varchar('phone_number').notNull(),
  ...timestamps
})

// Treatments
export const treatments = createTable('treatments', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("patient_id", { length: 255 }).
    references(() => patients.patientId, {onDelete: 'cascade'})
    .notNull(),
  treatmentName: varchar('treatment_name').notNull(),
  startDate: date("start_date", { mode: "date" }).notNull(),
  endDate: date("end_date", { mode: "date" }),
  ...timestamps
})

// Medications 
export const medications = createTable('medications', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("patient_id", { length: 255 }).
    references(() => patients.patientId, {onDelete: 'cascade'})
    .notNull(),
  medicationName: varchar('medication_name').notNull(),
  dosage: text('dosage').notNull(),
  frequency: medicationFrequencyEnum("frequency").notNull(),
  startDate: date("start_date", { mode: "date" }).notNull(),
  endDate: date("end_date", { mode: "date" }),
  ...timestamps
})

// Allergies
export const allergies = createTable('allergies', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("patient_id", { length: 255 }).
    references(() => patients.patientId, {onDelete: 'cascade'})
    .notNull(),
  allergen: varchar('allergen').notNull(),
  reactionDescription: text('reaction_description'),
  severityLevel: varchar('severity_level'),
  ...timestamps
})

// Diagnoses
export const diagnoses = createTable('diagnoses', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("patient_id", { length: 255 }).
    references(() => patients.patientId, {onDelete: 'cascade'})
    .notNull(),
  conditionName: varchar('condition_name').notNull(),
  diagnosisDate: date("diagnosis_date", { mode: "date" }).notNull(),
  status: varchar('status'),
  ...timestamps
})

// Cognitive Symptoms
export const cognitiveSymptoms = createTable('cognitive_symptoms', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("patient_id", { length: 255 }).
    references(() => patients.patientId, {onDelete: 'cascade'})
    .notNull(),
  symptomGype: varchar('symptom_type').notNull(),
  onsetDate: date("onset_date", { mode: "date" }).defaultNow(),
  severityLevel: numeric('severity_level'),
  notes: text('notes'),
  ...timestamps
})