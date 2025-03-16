import { pgTable, foreignKey, pgEnum, varchar, text, boolean, timestamp, json, index, unique, numeric, date, integer, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const appointmentStatus = pgEnum("appointment_status", ['Scheduled', 'Canceled', 'Completed'])
export const dayOfWeek = pgEnum("day_of_week", ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
export const frequency = pgEnum("frequency", ['daily', 'weekly', 'monthly', 'as_needed', 'prn'])
export const gender = pgEnum("gender", ['male', 'female', 'other', 'prefer_not_to_say'])
export const invoiceStatus = pgEnum("invoice_status", ['unpaid', 'paid'])
export const relationship = pgEnum("relationship", ['spouse', 'child', 'caregiver', 'parent', 'sibling', 'friend', 'other'])
export const status = pgEnum("status", ['Scheduled', 'Canceled', 'Completed', 'subscribed', 'unsubscribed', 'open', 'closed'])
export const subscriptionStatus = pgEnum("subscription_status", ['subscribed', 'unsubscribed'])
export const userRole = pgEnum("user_role", ['patient', 'doctor', 'admin'])


export const hippocampiMessages = pgTable("hippocampi_messages", {
	messageId: varchar("message_id", { length: 255 }).primaryKey().notNull(),
	conversationId: varchar("conversation_id", { length: 255 }).notNull().references(() => hippocampiConversations.conversationId, { onDelete: "cascade" } ),
	senderId: varchar("sender_id", { length: 255 }).notNull().references(() => hippocampiUsers.id, { onDelete: "cascade" } ),
	content: text("content").notNull(),
	read: boolean("read").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	time: timestamp("time", { withTimezone: true, mode: 'string' }).notNull(),
});

export const hippocampiCognitiveAssessments = pgTable("hippocampi_cognitive_assessments", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	primaryConcerns: json("primary_concerns").notNull(),
	additionalSupport: json("additional_support").default(null),
	mentalDemands: text("mental_demands").notNull(),
	cognitiveChanges: text("cognitive_changes").notNull(),
	areasForHelp: json("areas_for_help").default(null),
	additionalInfo: text("additional_info").default(''),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiDoctorAvailabilities = pgTable("hippocampi_doctor_availabilities", {
	recurringId: varchar("recurring_id", { length: 255 }).primaryKey().notNull(),
	doctorId: varchar("doctor_id", { length: 255 }).notNull().references(() => hippocampiDoctors.doctorId),
	dayOfWeek: dayOfWeek("day_of_week").notNull(),
	startTime: varchar("start_time").notNull(),
	endTime: varchar("end_time").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiSessions = pgTable("hippocampi_sessions", {
	sessionToken: varchar("session_token", { length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => hippocampiUsers.id, { onDelete: "cascade" } ),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		sessionUserIdIdx: index("session_user_id_idx").using("btree", table.userId),
	}
});

export const hippocampiDoctors = pgTable("hippocampi_doctors", {
	doctorId: varchar("doctor_id", { length: 255 }).primaryKey().notNull().references(() => hippocampiUsers.id, { onDelete: "cascade" } ),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	location: text("location").notNull(),
	specialization: varchar("specialization"),
	ratings: varchar("ratings", { length: 20 }),
	bio: text("bio").notNull(),
	profileUrl: varchar("profile_url", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		hippocampiDoctorsEmailUnique: unique("hippocampi_doctors_email_unique").on(table.email),
	}
});

export const hippocampiUserLogins = pgTable("hippocampi_user_logins", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => hippocampiUsers.id, { onDelete: "cascade" } ),
	action: varchar("action", { length: 255 }).notNull(),
	affectedPatientId: varchar("affected_patient_id", { length: 255 }).references(() => hippocampiPatients.patientId),
	notes: text("notes"),
},
(table) => {
	return {
		userLoginsActionIdx: index("user_logins_action_idx").using("btree", table.action),
		userLoginsPatientIdx: index("user_logins_patient_idx").using("btree", table.affectedPatientId),
		userLoginsUserIdx: index("user_logins_user_idx").using("btree", table.userId),
	}
});

export const hippocampiAppointments = pgTable("hippocampi_appointments", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	doctorId: varchar("doctor_id", { length: 255 }).notNull().references(() => hippocampiDoctors.doctorId),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId),
	scheduledAt: timestamp("scheduled_at", { withTimezone: true, mode: 'string' }).notNull(),
	reason: text("reason"),
	notes: text("notes"),
	appointmentStatus: appointmentStatus("appointment_status").default('Scheduled').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		meetingDateIdx: index("meeting_date_idx").using("btree", table.scheduledAt),
		meetingDoctorIdx: index("meeting_doctor_idx").using("btree", table.doctorId),
		meetingPatientIdx: index("meeting_patient_idx").using("btree", table.patientId),
	}
});

export const hippocampiInvoices = pgTable("hippocampi_invoices", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	stripePaymentId: varchar("stripe_payment_id", { length: 255 }),
	invoiceStatus: invoiceStatus("invoice_status").default('unpaid').notNull(),
	appointmentId: varchar("appointment_id", { length: 255 }).notNull().references(() => hippocampiAppointments.id),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId),
	doctorId: varchar("doctor_id", { length: 255 }).notNull().references(() => hippocampiDoctors.doctorId),
	hourlyRate: numeric("hourly_rate").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiPatientDoctorManagement = pgTable("hippocampi_patient_doctor_management", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	doctorId: varchar("doctor_id", { length: 255 }).notNull().references(() => hippocampiDoctors.doctorId, { onDelete: "cascade" } ),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	lastVisit: date("last_visit"),
	notes: text("notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiUsers = pgTable("hippocampi_users", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	email: varchar("email", { length: 255 }).notNull(),
	emailVerified: timestamp("email_verified", { withTimezone: true, mode: 'string' }).defaultNow(),
	image: varchar("image", { length: 255 }),
	mfaEnabled: boolean("mfa_enabled").default(false).notNull(),
	mfaVerified: boolean("mfa_verified").default(false).notNull(),
	mfaSecret: varchar("mfa_secret", { length: 255 }),
	mfaTempSecret: varchar("mfa_temp_secret", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiUserRoles = pgTable("hippocampi_user_roles", {
	userId: varchar("user_id", { length: 255 }).primaryKey().notNull().references(() => hippocampiUsers.id, { onDelete: "cascade" } ),
	userRole: userRole("user_role").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiCognitiveSymptoms = pgTable("hippocampi_cognitive_symptoms", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	symptomType: varchar("symptom_type").notNull(),
	onsetDate: date("onset_date").defaultNow(),
	severityLevel: varchar("severity_level"),
	notes: text("notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiDiagnoses = pgTable("hippocampi_diagnoses", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	conditionName: varchar("condition_name").notNull(),
	diagnosisDate: date("diagnosis_date").notNull(),
	selfReported: boolean("self_reported").default(false),
	notes: text("notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiSubscriptions = pgTable("hippocampi_subscriptions", {
	doctorId: varchar("doctor_id", { length: 255 }).primaryKey().notNull().references(() => hippocampiUsers.id, { onDelete: "cascade" } ),
	stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
	subscriptionId: varchar("subscription_id", { length: 255 }),
	subscriptionStatus: subscriptionStatus("subscription_status").default('unsubscribed').notNull(),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiAllergies = pgTable("hippocampi_allergies", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	allergen: varchar("allergen").notNull(),
	reactionDescription: text("reaction_description"),
	severityLevel: varchar("severity_level"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiTreatments = pgTable("hippocampi_treatments", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	treatmentName: varchar("treatment_name").notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),
	notes: varchar("notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiEmergencyContacts = pgTable("hippocampi_emergency_contacts", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
	relationship: relationship("relationship").notNull(),
	phoneNumber: varchar("phone_number").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiConversations = pgTable("hippocampi_conversations", {
	conversationId: varchar("conversation_id", { length: 255 }).primaryKey().notNull(),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	doctorId: varchar("doctor_id", { length: 255 }).notNull().references(() => hippocampiDoctors.doctorId, { onDelete: "cascade" } ),
	subject: varchar("subject", { length: 255 }),
	status: status("status").default('open'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiPatients = pgTable("hippocampi_patients", {
	patientId: varchar("patient_id", { length: 255 }).primaryKey().notNull().references(() => hippocampiUsers.id, { onDelete: "cascade" } ),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
	middleInitial: varchar("middle_initial"),
	condition: varchar("condition"),
	dateOfBirth: date("date_of_birth").notNull(),
	age: integer("age").notNull(),
	gender: gender("gender").notNull(),
	primaryLanguage: varchar("primary_language").notNull(),
	phoneNumber: varchar("phone_number").notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	streetAddress: text("street_address").notNull(),
	city: varchar("city").notNull(),
	state: varchar("state").notNull(),
	zipCode: varchar("zip_code").notNull(),
	hipaaCompliance: boolean("hipaa_compliance").notNull(),
	stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		hippocampiPatientsEmailUnique: unique("hippocampi_patients_email_unique").on(table.email),
	}
});

export const hippocampiDoctorCredentials = pgTable("hippocampi_doctor_credentials", {
	doctorId: varchar("doctor_id", { length: 255 }).primaryKey().notNull().references(() => hippocampiDoctors.doctorId, { onDelete: "cascade" } ),
	degree: varchar("degree", { length: 255 }).notNull(),
	medicalSchool: varchar("medical_school", { length: 255 }).notNull(),
	residency: varchar("residency", { length: 255 }).notNull(),
	approach: text("approach").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiMedicalHistory = pgTable("hippocampi_medical_history", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	existingDiagnoses: text("existing_diagnoses").default('n/a'),
	familyHistoryOfNeurologicalDisorders: text("family_history_of_neurological_disorders").default('n/a'),
	historyOfChemotherapyOrRadiationTherapy: text("history_of_chemotherapy_or_radiation_therapy").default('n/a'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiMedications = pgTable("hippocampi_medications", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	patientId: varchar("patient_id", { length: 255 }).notNull().references(() => hippocampiPatients.patientId, { onDelete: "cascade" } ),
	medicationName: varchar("medication_name").notNull(),
	dosage: text("dosage").notNull(),
	frequency: frequency("frequency").notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const hippocampiVerificationToken = pgTable("hippocampi_verification_token", {
	identifier: varchar("identifier", { length: 255 }).notNull(),
	token: varchar("token", { length: 255 }).notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'string' }).notNull(),
},
(table) => {
	return {
		hippocampiVerificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "hippocampi_verification_token_identifier_token_pk"}),
	}
});

export const hippocampiAccounts = pgTable("hippocampi_accounts", {
	userId: varchar("user_id", { length: 255 }).notNull().references(() => hippocampiUsers.id, { onDelete: "cascade" } ),
	type: varchar("type", { length: 255 }).notNull(),
	provider: varchar("provider", { length: 255 }).notNull(),
	providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: varchar("token_type", { length: 255 }),
	scope: varchar("scope", { length: 255 }),
	idToken: text("id_token"),
	sessionState: varchar("session_state", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		accountUserIdIdx: index("account_user_id_idx").using("btree", table.userId),
		hippocampiAccountsProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "hippocampi_accounts_provider_provider_account_id_pk"}),
	}
});