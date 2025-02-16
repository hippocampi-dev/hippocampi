import {
  date,
  decimal,
  index,
  numeric,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { patients } from "./patient";
import { doctors } from "./doctor";
import { timestamps } from "./utils";
import { createTable } from "./schema";
import { z } from "zod";

// User Roles
export const userRoles = createTable(
  "user_roles",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .primaryKey()
      .references(() => users.id, {onDelete: 'cascade'}), // Ensures one role per user
    userRole: varchar("user_role", { length: 255 }) // 'doctor' or 'patient'
      .notNull(),
    ...timestamps
  }
);

// patient-doctor management
export const patientDoctorManagement = createTable(
  "patient_doctor_management",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    doctorId: varchar("doctor_id", { length: 255 })
      .notNull()
      .references(() => doctors.doctorId, {onDelete: "cascade", onUpdate: "cascade"}),
    patientId: varchar("patient_id", { length: 255 })
      .notNull()
      .references(() => patients.patientId, {onDelete: "cascade", onUpdate: "cascade"}),
    lastVisit: date("last_visit"),
    notes: text("notes"),
    ...timestamps
  }
)

// appointments
export const appointmentStatusEnum = pgEnum("status", [
  "Scheduled",
  "Canceled",
  "Completed"
]);

export const appointments = createTable(
  "appointments",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    doctorId: varchar("doctor_id", { length: 255 })
      .notNull()
      .references(() => doctors.doctorId),
    patientId: varchar("patient_id", { length: 255 })
      .notNull()
      .references(() => patients.patientId),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true, mode: "date", precision: 0 })
      .notNull(),
    reason: text("reason"),
    notes: text("notes"), // Optional field for additional info
    status: appointmentStatusEnum('status').notNull().default("Scheduled"), // Options: scheduled, completed, canceled
    ...timestamps
  },
  (meeting) => ({
    doctorIdx: index("meeting_doctor_idx").on(meeting.doctorId),
    patientIdx: index("meeting_patient_idx").on(meeting.patientId),
    dateIdx: index("meeting_date_idx").on(meeting.scheduledAt),
  })
);

export const subscriptionStatusEnum = pgEnum('status', [
  'subscribed',
  'unsubscribed'
]);

// Payment
export const doctorSubcriptions = createTable('doctor_subscriptions', {
  doctorId: varchar("doctor_id", { length: 255 })
    .notNull()
    .primaryKey()
    .references(() => doctors.doctorId),
  subscriptionId: varchar('subscription_id', { length: 255 }).notNull(),
  status: subscriptionStatusEnum('status').default('unsubscribed').notNull(),
  startDate: timestamp('start_date', {mode: 'date'}).notNull(),
  cancelDate: timestamp('end_date', {mode: 'date'}),
  currentPeriodStart: timestamp('current_period_start', {mode: 'date'}).notNull(),
  currentPeriodEnd: timestamp('current_period_end', {mode: 'date'}).notNull(),
});

// patient invoices
const invoiceStatusEnum = pgEnum('status', [
  'unpaid',
  'paid'
]);

export const invoices = createTable('invoices', {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }),
  appointmentId: varchar('appointment_id', { length: 255 })
    .notNull()
    .references(() => appointments.id),
  patientId: varchar('patient_id', { length: 255 })
    .notNull()
    .references(() => patients.patientId),
  doctorId: varchar('doctor_id', { length: 255 })
    .notNull()
    .references(() => doctors.doctorId),
  amount: numeric('amount', { precision: 2 }),
  status: invoiceStatusEnum('status')
    .notNull()
    .default('unpaid')
});