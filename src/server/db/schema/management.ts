import {
  date,
  decimal,
  index,
  integer,
  numeric,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './auth';
import { patients } from './patient';
import { doctors } from './doctor';
import { timestamps } from './utils';
import { createTable } from './schema';

// User Roles
export const rolesEnum = pgEnum('user_role', [
  'patient',
  'doctor',
  'admin'
]);
export const userRoles = createTable(
  'user_roles',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .primaryKey()
      .references(() => users.id, {onDelete: 'cascade'}), // Ensures one role per user
    userRole: rolesEnum('user_role')
      .notNull(),
    ...timestamps
  }
);

// patient-doctor management
export const patientDoctorManagement = createTable(
  'patient_doctor_management',
  {
    id: varchar('id', { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    doctorId: varchar('doctor_id', { length: 255 })
      .notNull()
      .references(() => doctors.doctorId, {onDelete: 'cascade'}),
    patientId: varchar('patient_id', { length: 255 })
      .notNull()
      .references(() => patients.patientId, {onDelete: 'cascade'}),
    lastVisit: date('last_visit'),
    notes: text('notes'),
    ...timestamps
  }
)

// appointments
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'Scheduled',
  'Canceled',
  'Completed',
  'No-Show'
]);

export const appointments = createTable(
  'appointments',
  {
    id: varchar('id', { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    doctorId: varchar('doctor_id', { length: 255 })
      .notNull()
      .references(() => doctors.doctorId),
    patientId: varchar('patient_id', { length: 255 })
      .notNull()
      .references(() => patients.patientId),
    scheduledAt: timestamp('scheduled_at', { mode: 'string' })
      .notNull(),
    reason: text('reason'),
    notes: text('notes'), // Optional field for additional info
    status: appointmentStatusEnum('appointment_status').notNull().default('Scheduled'),
    ...timestamps
  },
  (meeting) => ({
    doctorIdx: index('meeting_doctor_idx').on(meeting.doctorId),
    patientIdx: index('meeting_patient_idx').on(meeting.patientId),
    dateIdx: index('meeting_date_idx').on(meeting.scheduledAt),
  })
);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'subscribed',
  'unsubscribed'
]);

// Payment
export const subscriptions = createTable('subscriptions', {
  userId: varchar('doctor_id', { length: 255 })
    .notNull()
    .primaryKey()
    .references(() => users.id, {onDelete: 'cascade'}),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  subscriptionId: varchar('subscription_id', { length: 255 }),
  status: subscriptionStatusEnum('subscription_status').default('unsubscribed').notNull(),
  startDate: timestamp('start_date', {mode: 'date'}),
  cancelDate: timestamp('end_date', {mode: 'date'}),
  ...timestamps
});

// patient invoices
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'unpaid',
  'paid'
]);

export const invoices = createTable('invoices', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }),
  status: invoiceStatusEnum('invoice_status').notNull().default('unpaid'),
  appointmentId: varchar('appointment_id', { length: 255 })
    .notNull()
    .references(() => appointments.id),
  patientId: varchar('patient_id', { length: 255 })
    .notNull()
    .references(() => patients.patientId),
  doctorId: varchar('doctor_id', { length: 255 })
    .notNull()
    .references(() => doctors.doctorId),
  hourlyRate: numeric('hourly_rate').notNull(),
  notes: text('notes'),
  ...timestamps
});