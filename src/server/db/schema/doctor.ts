import { relations, sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  time,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { timestamps } from "./utils";
import { createTable } from "./schema";

// Doctors
export const doctors = createTable(
  "doctors",
  {
    doctorId: varchar("doctor_id", { length: 255 })
      .notNull()
      .primaryKey()
      .references(() => users.id, {onDelete: 'cascade'}),
    firstName: varchar('first_name').notNull(),
    lastName: varchar('last_name').notNull(),
    email: varchar("email", { length: 255 })
      .notNull()
      .unique(),
    location: text("location")
      .notNull(),
    specialization: varchar("specialization"),
    ratings: varchar("ratings", { length: 20 }),
    bio: text('bio').notNull(),
    profileUrl: varchar('profile_url', { length: 255 }).notNull(),
    ...timestamps
  }
)

// other info
export const doctorCredentials = createTable(
  "doctor_credentials",
  {
    doctorId: varchar("doctor_id", { length: 255 })
      .primaryKey()
      .notNull()
      .references(() => doctors.doctorId, {onDelete: 'cascade'}),
    degree: varchar("degree", { length: 255 }).notNull(),
    medicalSchool: varchar("medical_school", { length: 255 }).notNull(),
    residency: varchar("residency", { length: 255 }).notNull(),
    approach: text("approach").notNull(),
    ...timestamps
  }
)

export const daysOfWeekEnum = pgEnum("day_of_week", [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]);

export const doctorAvailabilities = createTable(
  "doctor_availabilities",
  {
    recurringId: varchar("recurring_id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    doctorId: varchar('doctor_id', { length: 255 })
      .notNull()
      .references(() => doctors.doctorId),
    dayOfWeek: daysOfWeekEnum("day_of_week").notNull(),
    startTime: varchar("start_time").notNull(),
    endTime: varchar("end_time").notNull(),
    ...timestamps
  }
)