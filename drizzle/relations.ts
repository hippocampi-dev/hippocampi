import { relations } from "drizzle-orm/relations";
import { hippocampiConversations, hippocampiMessages, hippocampiUsers, hippocampiPatients, hippocampiCognitiveAssessments, hippocampiDoctors, hippocampiDoctorAvailabilities, hippocampiSessions, hippocampiUserLogins, hippocampiAppointments, hippocampiInvoices, hippocampiPatientDoctorManagement, hippocampiUserRoles, hippocampiCognitiveSymptoms, hippocampiDiagnoses, hippocampiSubscriptions, hippocampiAllergies, hippocampiTreatments, hippocampiEmergencyContacts, hippocampiDoctorCredentials, hippocampiMedicalHistory, hippocampiMedications, hippocampiAccounts } from "./schema";

export const hippocampiMessagesRelations = relations(hippocampiMessages, ({one}) => ({
	hippocampiConversation: one(hippocampiConversations, {
		fields: [hippocampiMessages.conversationId],
		references: [hippocampiConversations.conversationId]
	}),
	hippocampiUser: one(hippocampiUsers, {
		fields: [hippocampiMessages.senderId],
		references: [hippocampiUsers.id]
	}),
}));

export const hippocampiConversationsRelations = relations(hippocampiConversations, ({one, many}) => ({
	hippocampiMessages: many(hippocampiMessages),
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiConversations.patientId],
		references: [hippocampiPatients.patientId]
	}),
	hippocampiDoctor: one(hippocampiDoctors, {
		fields: [hippocampiConversations.doctorId],
		references: [hippocampiDoctors.doctorId]
	}),
}));

export const hippocampiUsersRelations = relations(hippocampiUsers, ({many}) => ({
	hippocampiMessages: many(hippocampiMessages),
	hippocampiSessions: many(hippocampiSessions),
	hippocampiDoctors: many(hippocampiDoctors),
	hippocampiUserLogins: many(hippocampiUserLogins),
	hippocampiUserRoles: many(hippocampiUserRoles),
	hippocampiSubscriptions: many(hippocampiSubscriptions),
	hippocampiPatients: many(hippocampiPatients),
	hippocampiAccounts: many(hippocampiAccounts),
}));

export const hippocampiCognitiveAssessmentsRelations = relations(hippocampiCognitiveAssessments, ({one}) => ({
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiCognitiveAssessments.patientId],
		references: [hippocampiPatients.patientId]
	}),
}));

export const hippocampiPatientsRelations = relations(hippocampiPatients, ({one, many}) => ({
	hippocampiCognitiveAssessments: many(hippocampiCognitiveAssessments),
	hippocampiUserLogins: many(hippocampiUserLogins),
	hippocampiAppointments: many(hippocampiAppointments),
	hippocampiInvoices: many(hippocampiInvoices),
	hippocampiPatientDoctorManagements: many(hippocampiPatientDoctorManagement),
	hippocampiCognitiveSymptoms: many(hippocampiCognitiveSymptoms),
	hippocampiDiagnoses: many(hippocampiDiagnoses),
	hippocampiAllergies: many(hippocampiAllergies),
	hippocampiTreatments: many(hippocampiTreatments),
	hippocampiEmergencyContacts: many(hippocampiEmergencyContacts),
	hippocampiConversations: many(hippocampiConversations),
	hippocampiUser: one(hippocampiUsers, {
		fields: [hippocampiPatients.patientId],
		references: [hippocampiUsers.id]
	}),
	hippocampiMedicalHistories: many(hippocampiMedicalHistory),
	hippocampiMedications: many(hippocampiMedications),
}));

export const hippocampiDoctorAvailabilitiesRelations = relations(hippocampiDoctorAvailabilities, ({one}) => ({
	hippocampiDoctor: one(hippocampiDoctors, {
		fields: [hippocampiDoctorAvailabilities.doctorId],
		references: [hippocampiDoctors.doctorId]
	}),
}));

export const hippocampiDoctorsRelations = relations(hippocampiDoctors, ({one, many}) => ({
	hippocampiDoctorAvailabilities: many(hippocampiDoctorAvailabilities),
	hippocampiUser: one(hippocampiUsers, {
		fields: [hippocampiDoctors.doctorId],
		references: [hippocampiUsers.id]
	}),
	hippocampiAppointments: many(hippocampiAppointments),
	hippocampiInvoices: many(hippocampiInvoices),
	hippocampiPatientDoctorManagements: many(hippocampiPatientDoctorManagement),
	hippocampiConversations: many(hippocampiConversations),
	hippocampiDoctorCredentials: many(hippocampiDoctorCredentials),
}));

export const hippocampiSessionsRelations = relations(hippocampiSessions, ({one}) => ({
	hippocampiUser: one(hippocampiUsers, {
		fields: [hippocampiSessions.userId],
		references: [hippocampiUsers.id]
	}),
}));

export const hippocampiUserLoginsRelations = relations(hippocampiUserLogins, ({one}) => ({
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiUserLogins.affectedPatientId],
		references: [hippocampiPatients.patientId]
	}),
	hippocampiUser: one(hippocampiUsers, {
		fields: [hippocampiUserLogins.userId],
		references: [hippocampiUsers.id]
	}),
}));

export const hippocampiAppointmentsRelations = relations(hippocampiAppointments, ({one, many}) => ({
	hippocampiDoctor: one(hippocampiDoctors, {
		fields: [hippocampiAppointments.doctorId],
		references: [hippocampiDoctors.doctorId]
	}),
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiAppointments.patientId],
		references: [hippocampiPatients.patientId]
	}),
	hippocampiInvoices: many(hippocampiInvoices),
}));

export const hippocampiInvoicesRelations = relations(hippocampiInvoices, ({one}) => ({
	hippocampiAppointment: one(hippocampiAppointments, {
		fields: [hippocampiInvoices.appointmentId],
		references: [hippocampiAppointments.id]
	}),
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiInvoices.patientId],
		references: [hippocampiPatients.patientId]
	}),
	hippocampiDoctor: one(hippocampiDoctors, {
		fields: [hippocampiInvoices.doctorId],
		references: [hippocampiDoctors.doctorId]
	}),
}));

export const hippocampiPatientDoctorManagementRelations = relations(hippocampiPatientDoctorManagement, ({one}) => ({
	hippocampiDoctor: one(hippocampiDoctors, {
		fields: [hippocampiPatientDoctorManagement.doctorId],
		references: [hippocampiDoctors.doctorId]
	}),
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiPatientDoctorManagement.patientId],
		references: [hippocampiPatients.patientId]
	}),
}));

export const hippocampiUserRolesRelations = relations(hippocampiUserRoles, ({one}) => ({
	hippocampiUser: one(hippocampiUsers, {
		fields: [hippocampiUserRoles.userId],
		references: [hippocampiUsers.id]
	}),
}));

export const hippocampiCognitiveSymptomsRelations = relations(hippocampiCognitiveSymptoms, ({one}) => ({
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiCognitiveSymptoms.patientId],
		references: [hippocampiPatients.patientId]
	}),
}));

export const hippocampiDiagnosesRelations = relations(hippocampiDiagnoses, ({one}) => ({
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiDiagnoses.patientId],
		references: [hippocampiPatients.patientId]
	}),
}));

export const hippocampiSubscriptionsRelations = relations(hippocampiSubscriptions, ({one}) => ({
	hippocampiUser: one(hippocampiUsers, {
		fields: [hippocampiSubscriptions.doctorId],
		references: [hippocampiUsers.id]
	}),
}));

export const hippocampiAllergiesRelations = relations(hippocampiAllergies, ({one}) => ({
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiAllergies.patientId],
		references: [hippocampiPatients.patientId]
	}),
}));

export const hippocampiTreatmentsRelations = relations(hippocampiTreatments, ({one}) => ({
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiTreatments.patientId],
		references: [hippocampiPatients.patientId]
	}),
}));

export const hippocampiEmergencyContactsRelations = relations(hippocampiEmergencyContacts, ({one}) => ({
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiEmergencyContacts.patientId],
		references: [hippocampiPatients.patientId]
	}),
}));

export const hippocampiDoctorCredentialsRelations = relations(hippocampiDoctorCredentials, ({one}) => ({
	hippocampiDoctor: one(hippocampiDoctors, {
		fields: [hippocampiDoctorCredentials.doctorId],
		references: [hippocampiDoctors.doctorId]
	}),
}));

export const hippocampiMedicalHistoryRelations = relations(hippocampiMedicalHistory, ({one}) => ({
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiMedicalHistory.patientId],
		references: [hippocampiPatients.patientId]
	}),
}));

export const hippocampiMedicationsRelations = relations(hippocampiMedications, ({one}) => ({
	hippocampiPatient: one(hippocampiPatients, {
		fields: [hippocampiMedications.patientId],
		references: [hippocampiPatients.patientId]
	}),
}));

export const hippocampiAccountsRelations = relations(hippocampiAccounts, ({one}) => ({
	hippocampiUser: one(hippocampiUsers, {
		fields: [hippocampiAccounts.userId],
		references: [hippocampiUsers.id]
	}),
}));