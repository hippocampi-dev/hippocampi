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
import { createTable } from "./auth";
import { users } from "./auth";
import { timestamps } from './util'

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
  patientId: varchar("patientId", { length: 255 })
    .notNull()
    .primaryKey()
    .references(() => users.id, {onDelete: 'cascade'}),
  first_name: varchar('first_name').notNull(),
  last_name: varchar('last_name').notNull(),
  middle_initial: varchar('middle_initial'),
  date_of_birth: date("date", { mode: "date" }).notNull(),
  gender: genderEnum("gender").notNull(),
  primary_language: varchar('primary_language').notNull(),
  phone_number: varchar('phone_number').notNull(),
  email: varchar("email", { length: 255 })
    .notNull()
    .references(() => users.email, {onDelete: 'cascade'}),
  street_address: text('street_address').notNull(),
  city: varchar('city').notNull(),
  state: varchar('state').notNull(),
  zip_code: varchar('zip_code').notNull(),
  ...timestamps
})

// Emergency Contacts
export const emergencyContacts = createTable('emergency_contacts', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("doctorId", { length: 255 }).references(() => patients.patientId, {onDelete: 'cascade'}).notNull(),
  name: varchar('name').notNull(),
  relationship: relationshipEnum("relationship").notNull(),
  phone_number: varchar('phone_number').notNull(),
  ...timestamps
})

// Medications
export const medications = createTable('medications', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("doctorId", { length: 255 }).references(() => patients.patientId, {onDelete: 'cascade'}).notNull(),
  medication_name: varchar('medication_name').notNull(),
  dosage: text('dosage').notNull(),
  frequency: medicationFrequencyEnum("frequency").notNull(),
  start_date: date("start_date", { mode: "date" }).notNull(),
  end_date: date("end_date", { mode: "date" }).notNull(),
  ...timestamps
})

// Allergies
export const allergies = createTable('allergies', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("doctorId", { length: 255 }).references(() => patients.patientId, {onDelete: 'cascade'}).notNull(),
  allergen: varchar('allergen').notNull(),
  reaction_description: text('reaction_description'),
  severity_level: varchar('severity_level'),
  ...timestamps
})

// Diagnoses
export const diagnoses = createTable('diagnoses', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("doctorId", { length: 255 }).references(() => patients.patientId, {onDelete: 'cascade'}).notNull(),
  condition_name: varchar('condition_name').notNull(),
  diagnosis_date: date("diagnosis_date", { mode: "date" }).notNull(),
  status: varchar('status'),
  ...timestamps
})

// Cognitive Symptoms
export const cognitiveSymptoms = createTable('cognitive_symptoms', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patientId: varchar("doctorId", { length: 255 }).references(() => patients.patientId, {onDelete: 'cascade'}).notNull(),
  symptom_type: varchar('symptom_type').notNull(),
  onset_date: date("onset_date", { mode: "date" }).defaultNow(),
  severity_level: numeric('severity_level'),
  notes: text('notes'),
  ...timestamps
})