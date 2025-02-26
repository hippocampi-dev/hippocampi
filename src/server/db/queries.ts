// this is where we'll have our query functions for the db

import * as schema_auth from "./schema/auth";
import * as schema_doctor from "./schema/doctor";
import * as schema_management from "./schema/management";
import * as schema_patient from "./schema/patient";
import * as schema_message from "./schema/message";
import { eq } from "drizzle-orm";
import {
  DoctorCredentialsInterface,
  DoctorsInterface,
  PatientAllergiesInterface,
  PatientCognitiveSymptomsInterface,
  PatientDiagnosesInterface,
  PatientDoctorManagementInterface,
  PatientEmergencyContactsInterface,
  PatientHealthInformationInterface,
  PatientMedicationsInterface,
  PatientsInterface,
  PatientTreatmentsInterface,
  AppointmentsIdInterface,
  AppointmentsInterface,
  UserIdInterface,
  UserRolesInterface,
  PatientMedicalHistoryInterface,
  SubscriptionsInterface,
  InvoicesInterface,
  ConversationsInterface,
  MessagesInterface,
  IPatient,
  PatientDict,
  AppointmentInvoiceDict,
} from "./type";
import { db } from ".";
import { desc, asc } from "drizzle-orm";

// add user role
export const addUserRole = async (user: UserRolesInterface) => {
  return db
    .insert(schema_management.userRoles)
    .values(user)
    .onConflictDoNothing()
    .returning();
};

// get user role
export const getUserRole = async (user_id: UserIdInterface) => {
  return db.query.userRoles.findFirst({
    where: eq(schema_management.userRoles.userId, user_id),
  });
};

// verify if user had role
export const hasUserRole = async (user_id: UserIdInterface) => {
  // returns an array
  const result_array = await db
    .select()
    .from(schema_management.userRoles)
    .where(eq(schema_management.userRoles.userId, user_id));

  // return 1 if user exists, 0 otherwise
  return result_array.length === 1; // return true / false
};

// add patient
export const addPatient = async (patient: PatientsInterface) => {
  return db
    .insert(schema_patient.patients)
    .values(patient)
    .onConflictDoNothing()
    .returning();
};

// set patient
export const setPatient = async (
  user_id: UserIdInterface,
  patient: PatientsInterface,
) => {
  return db
    .update(schema_patient.patients)
    .set(patient)
    .where(eq(schema_patient.patients.patientId, user_id))
    .returning();
};

// get patient
export const getPatient = async (user_id: UserIdInterface) => {
  return db.query.patients.findFirst({
    where: eq(schema_patient.patients.patientId, user_id),
  });
};
// get patient
export const getPatients = async (doctor_id: UserIdInterface) => {
  const management = await getAllPatientDoctorManagement(doctor_id);
  const patients: PatientsInterface[] = [];

  for (const m of management) {
    const patient = await getPatient(m.patientId as "string");
    if (patient) {
      patients.push(patient);
    }
  }

  return patients;
};

// add doctor
export const addDoctor = async (doctor: DoctorsInterface) => {
  return db
    .insert(schema_doctor.doctors)
    .values(doctor)
    .onConflictDoNothing()
    .returning();
};

// set doctor
export const setDoctor = async (
  user_id: UserIdInterface,
  doctor: DoctorsInterface,
) => {
  return db
    .update(schema_doctor.doctors)
    .set(doctor)
    .where(eq(schema_doctor.doctors.doctorId, user_id))
    .returning();
};

// get doctor
export const getDoctor = async (user_id: UserIdInterface) => {
  return db.query.doctors.findFirst({
    where: eq(schema_doctor.doctors.doctorId, user_id),
  });
};

export const getAllDoctors = async () => {
  return db.query.doctors.findMany();
};

// add doctor credentials
export const addDoctorCredentials = async (
  doctorCredentials: DoctorCredentialsInterface,
) => {
  return db
    .insert(schema_doctor.doctorCredentials)
    .values(doctorCredentials)
    .onConflictDoNothing()
    .returning();
};

// set doctor credentials
export const setDoctorCredentials = async (
  user_id: UserIdInterface,
  doctorCredential: DoctorCredentialsInterface,
) => {
  return db
    .update(schema_doctor.doctorCredentials)
    .set(doctorCredential)
    .where(eq(schema_doctor.doctorCredentials.doctorId, user_id))
    .returning();
};

// get doctor credentials
export const getDoctorCredentials = async (user_id: UserIdInterface) => {
  return db.query.doctorCredentials.findFirst({
    where: eq(schema_doctor.doctorCredentials.doctorId, user_id),
  });
};

// add patient-doctor management
export const addPatientDoctorManagement = async (
  patientDoctorManagement: PatientDoctorManagementInterface,
) => {
  return db
    .insert(schema_management.patientDoctorManagement)
    .values(patientDoctorManagement)
    .onConflictDoNothing()
    .returning();
};

// remove patient-doctor management

// get patient-doctor management
export const getAllPatientDoctorManagement = async (
  user_id: UserIdInterface,
) => {
  const userRole = await getUserRole(user_id);

  if (userRole?.userRole === "doctor") {
    // if doctor, get patients
    return db.query.patientDoctorManagement.findMany({
      where: eq(schema_management.patientDoctorManagement.doctorId, user_id),
    });
  }

  // other if patient
  return db.query.patientDoctorManagement.findMany({
    where: eq(schema_management.patientDoctorManagement.patientId, user_id),
  });
};
export const getPatientDoctorManagement = async (user_id: UserIdInterface) => {
  const userRole = await getUserRole(user_id);

  if (userRole?.userRole === "doctor") {
    // if doctor, get patients
    return db.query.patientDoctorManagement.findFirst({
      where: eq(schema_management.patientDoctorManagement.doctorId, user_id),
    });
  }

  // other if patient
  return db.query.patientDoctorManagement.findFirst({
    where: eq(schema_management.patientDoctorManagement.patientId, user_id),
  });
};

// add scheduled meeting
export const addAppointment = async (meeting: AppointmentsInterface) => {
  return db
    .insert(schema_management.appointments)
    .values(meeting)
    .onConflictDoNothing()
    .returning();
};

// cancel meeting
export const cancelAppointment = async (
  meeting_id: AppointmentsIdInterface,
) => {
  return db
    .update(schema_management.appointments)
    .set({ status: "Canceled" })
    .where(eq(schema_management.appointments.id, meeting_id))
    .returning();
};

// get scheduled meeting
export const getAppointments = async (user_id: UserIdInterface) => {
  const userRole = await getUserRole(user_id);

  if (userRole?.userRole === "doctor") {
    return db.query.appointments.findMany({
      where: eq(schema_management.appointments.doctorId, user_id),
    });
  }

  return db.query.appointments.findMany({
    where: eq(schema_management.appointments.patientId, user_id),
  });
};
// get scheduled meeting
export const getAppointment = async (appointment_id: string) => {
  return db.query.appointments.findFirst({
    where: eq(schema_management.appointments.id, appointment_id),
  });
};

// add allergies
export const addAllergies = async (allergy: PatientAllergiesInterface) => {
  return db
    .insert(schema_patient.allergies)
    .values(allergy)
    .onConflictDoNothing()
    .returning();
};

// set allergies
export const setAllergies = async (
  user_id: UserIdInterface,
  allergy: PatientAllergiesInterface,
) => {
  return db
    .update(schema_patient.allergies)
    .set(allergy)
    .where(eq(schema_patient.allergies.patientId, user_id))
    .returning();
};

// get allergies
export const getAllergies = async (user_id: UserIdInterface) => {
  return db.query.allergies.findMany({
    where: eq(schema_patient.allergies.patientId, user_id),
  });
};

// add cognitive symptoms
export const addCognitiveSymptoms = async (
  cognitiveSymptom: PatientCognitiveSymptomsInterface,
) => {
  return db
    .insert(schema_patient.cognitiveSymptoms)
    .values(cognitiveSymptom)
    .onConflictDoNothing()
    .returning();
};

// set cognitive symptoms
export const setCognitiveSymptoms = async (
  user_id: UserIdInterface,
  cognitiveSymptom: PatientCognitiveSymptomsInterface,
) => {
  return db
    .update(schema_patient.cognitiveSymptoms)
    .set(cognitiveSymptom)
    .where(eq(schema_patient.cognitiveSymptoms.patientId, user_id))
    .returning();
};

// get cognitive symptoms
export const getCognitiveSymptoms = async (user_id: UserIdInterface) => {
  return db.query.cognitiveSymptoms.findMany({
    where: eq(schema_patient.cognitiveSymptoms.patientId, user_id),
  });
};

// add diagnoses
export const addDiagnoses = async (diagnosis: PatientDiagnosesInterface) => {
  return db
    .insert(schema_patient.diagnoses)
    .values(diagnosis)
    .onConflictDoNothing()
    .returning();
};

// set diagnoses
export const setDiagnoses = async (
  user_id: UserIdInterface,
  dianosis: PatientDiagnosesInterface,
) => {
  return db
    .update(schema_patient.diagnoses)
    .set(dianosis)
    .where(eq(schema_patient.diagnoses.patientId, user_id))
    .returning();
};

// get diagnoses
export const getDiagnoses = async (user_id: UserIdInterface) => {
  return db.query.diagnoses.findMany({
    where: eq(schema_patient.diagnoses.patientId, user_id),
  });
};

// add Emergency Contact
export const addEmergencyContacts = async (
  emergencyContact: PatientEmergencyContactsInterface,
) => {
  return db
    .insert(schema_patient.emergencyContacts)
    .values(emergencyContact)
    .onConflictDoNothing()
    .returning();
};

// set Emergency Contact
export const setEmergencyContacts = async (
  user_id: UserIdInterface,
  emergencyContact: PatientEmergencyContactsInterface,
) => {
  return db
    .update(schema_patient.emergencyContacts)
    .set(emergencyContact)
    .where(eq(schema_patient.emergencyContacts.patientId, user_id))
    .returning();
};

// get Emergency Contact
export const getEmergencyContacts = async (user_id: UserIdInterface) => {
  return db.query.emergencyContacts.findMany({
    where: eq(schema_patient.emergencyContacts.patientId, user_id),
  });
};

// add medications
export const addMedications = async (
  medication: PatientMedicationsInterface,
) => {
  return db
    .insert(schema_patient.medications)
    .values(medication)
    .onConflictDoNothing()
    .returning();
};

// set medication
export const setMedications = async (
  user_id: UserIdInterface,
  medication: PatientMedicationsInterface,
) => {
  return db
    .update(schema_patient.medications)
    .set(medication)
    .where(eq(schema_patient.medications.patientId, user_id))
    .returning();
};

// get medications
export const getMedications = async (user_id: UserIdInterface) => {
  return db.query.medications.findMany({
    where: eq(schema_patient.medications.patientId, user_id),
  });
};

// add treatments
export const addTreatments = async (treatment: PatientTreatmentsInterface) => {
  return db
    .insert(schema_patient.treatments)
    .values(treatment)
    .onConflictDoNothing()
    .returning();
};

// set treatments
export const setTreatments = async (
  user_id: UserIdInterface,
  treatment: PatientTreatmentsInterface,
) => {
  return db
    .update(schema_patient.treatments)
    .set(treatment)
    .where(eq(schema_patient.medications.patientId, user_id))
    .returning();
};

// get treatments
export const getTreatments = async (user_id: UserIdInterface) => {
  return db.query.treatments.findMany({
    where: eq(schema_patient.treatments.patientId, user_id),
  });
};

// add treatments
export const addMedicalHistory = async (
  medicalHistory: PatientMedicalHistoryInterface,
) => {
  return db
    .insert(schema_patient.medicalHistory)
    .values(medicalHistory)
    .onConflictDoNothing()
    .returning();
};

// set treatments
export const setMedicalHistory = async (
  user_id: UserIdInterface,
  medicalHistory: PatientMedicalHistoryInterface,
) => {
  return db
    .update(schema_patient.medicalHistory)
    .set(medicalHistory)
    .where(eq(schema_patient.medications.patientId, user_id))
    .returning();
};

// get treatments
export const getMedicalHistory = async (user_id: UserIdInterface) => {
  return db.query.medicalHistory.findFirst({
    where: eq(schema_patient.medicalHistory.patientId, user_id),
  });
};

// get patient health information
export const getPatientHealthInformation = async (user_id: UserIdInterface) => {
  const _allergies = await db.query.allergies.findMany({
    where: eq(schema_patient.allergies.patientId, user_id),
  });
  const _cognitiveSymptoms = await db.query.cognitiveSymptoms.findFirst({
    where: eq(schema_patient.cognitiveSymptoms.patientId, user_id),
  });
  const _diagnoses = await db.query.diagnoses.findMany({
    where: eq(schema_patient.diagnoses.patientId, user_id),
  });
  const _emergencyContacts = await db.query.emergencyContacts.findMany({
    where: eq(schema_patient.emergencyContacts.patientId, user_id)
  });
  const _medications = await db.query.medications.findMany({
    where: eq(schema_patient.medications.patientId, user_id),
  });
  const _treatments = await db.query.treatments.findMany({
    where: eq(schema_patient.treatments.patientId, user_id),
  });
  const _medicalHistory = await db.query.medicalHistory.findFirst({
    where: eq(schema_patient.medicalHistory.patientId, user_id),
  });

  const patientHealthInformation: PatientHealthInformationInterface = {
    medicalHistory: _medicalHistory!,
    allergies: _allergies,
    cognitiveSymptoms: _cognitiveSymptoms!,
    diagnoses: _diagnoses,
    emergencyContacts: _emergencyContacts,
    medications: _medications,
    treatments: _treatments,
  };

  return patientHealthInformation;
};

// add doctor subscription
export const addDoctorSubscription = async (
  subscription: SubscriptionsInterface,
) => {
  return db
    .insert(schema_management.subscriptions)
    .values(subscription)
    .onConflictDoNothing()
    .returning();
};

// set doctor subscription
export const setDoctorSubscription = async (
  user_id: UserIdInterface,
  subscription: SubscriptionsInterface,
) => {
  return db
    .update(schema_management.subscriptions)
    .set(subscription)
    .where(eq(schema_management.subscriptions.userId, user_id))
    .returning();
};

// get doctor subscription
export const getDoctorSubscription = async (
  user_id: UserIdInterface,
  stripe_customer_id?: string,
) => {
  if (stripe_customer_id) {
    return db.query.subscriptions.findFirst({
      where: eq(
        schema_management.subscriptions.stripeCustomerId,
        stripe_customer_id,
      ),
    });
  }
  return db.query.subscriptions.findFirst({
    where: eq(schema_management.subscriptions.userId, user_id),
  });
};

// verify if doctor is subscribed
export const isDoctorSubscribed = async (user_id: UserIdInterface) => {
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(schema_management.subscriptions.userId, user_id),
  });

  return subscription!.status === "subscribed"; // return true / false
};

// add invoice
export const addInvoice = async (invoice: InvoicesInterface) => {
  return db
    .insert(schema_management.invoices)
    .values(invoice)
    .onConflictDoNothing()
    .returning();
};

// set doctor subscription
export const setInvoice = async (invoice: InvoicesInterface) => {
  return db
    .update(schema_management.invoices)
    .set(invoice)
    .where(eq(schema_management.invoices.id, invoice.id!))
    .returning();
};

// get invoice
export const getInvoices = async (user_id: UserIdInterface) => {
  const userRole = await getUserRole(user_id);

  if (userRole?.userRole === "doctor") {
    return db.query.invoices.findMany({
      where: eq(schema_management.invoices.doctorId, user_id),
    });
  }

  return db.query.invoices.findMany({
    where: eq(schema_management.invoices.patientId, user_id),
  });
};

export const getTargetInvoice = async (invoice_id: string) => {
  return db.query.invoices.findFirst({
    where: eq(schema_management.invoices.id, invoice_id),
  });
};

export const getConversation = async (
  patientId: string,
  doctorId: string,
): Promise<ConversationsInterface | null> => {
  const conversation = await db.query.conversations.findFirst({
    where:
      eq(schema_message.conversations.patientId, patientId) &&
      eq(schema_message.conversations.doctorId, doctorId),
  });
  return conversation ?? null;
};

export const createConversation = async (data: {
  patientId: string;
  doctorId: string;
  subject?: string;
}): Promise<ConversationsInterface[]> => {
  return db
    .insert(schema_message.conversations)
    .values(data)
    .onConflictDoNothing()
    .returning();
};

export const getMessages = async (
  conversationId: string,
): Promise<MessagesInterface[]> => {
  return db.query.messages.findMany({
    where: eq(schema_message.messages.conversationId, conversationId),
    orderBy: asc(schema_message.messages.created_at),
  });
};

export const createMessage = async (data: {
  conversationId: string;
  senderId: string;
  content: string;
  read?: boolean;
}): Promise<MessagesInterface[]> => {
  return db
    .insert(schema_message.messages)
    .values({ ...data, read: data.read ?? false })
    .returning();
};

export const getPatientDict = async (doctor_id: UserIdInterface) => {
  const doctor = await getDoctor(doctor_id);
  const appointments = await getAppointments(doctor_id);
  const management = await getAllPatientDoctorManagement(doctor_id);
  const fetchedPatients: PatientsInterface[] = [];
  const patientDict: PatientDict = {};

  // Process patients sequentially to ensure data consistency
  for (const m of management) {
    const patientId = m.patientId as "string";
    const patient = await getPatient(patientId);
    if (!patient) continue;

    fetchedPatients.push(patient);
    const healthInfo = await getPatientHealthInformation(patientId);
    const filteredAppointments = filterAppointments(
      appointments,
      doctor?.doctorId!,
      patient.patientId,
    );

    patientDict[m.patientId] = {
      patient,
      management: m,
      healthInfo,
      appointments: filteredAppointments,
    };
  }

  return patientDict;
};
const filterAppointments = (
  appointments: AppointmentsInterface[],
  doctorId: string,
  patientId: string,
) => {
  return appointments.filter(
    (appointment) =>
      appointment.doctorId === doctorId && appointment.patientId === patientId,
  );
};

export const getInvoiceDict = async (doctor_id: UserIdInterface) => {
  const appointments = await getAppointments(doctor_id);
  const invoices = await getInvoices(doctor_id);
  return createAppointmentInvoiceDictionary(appointments, invoices);
};
function createAppointmentInvoiceDictionary(
  appointments: AppointmentsInterface[],
  invoices: InvoicesInterface[],
): AppointmentInvoiceDict {
  const dictionary: AppointmentInvoiceDict = {};

  invoices.forEach((invoice) => {
    const matchingAppointment = appointments.find(
      (appointment) => appointment.id === invoice.appointmentId,
    );

    if (matchingAppointment) {
      dictionary[invoice.id!] = matchingAppointment;
    } else {
      console.warn(`Invoice ${invoice.id} has no matching appointment`);
    }
  });

  return dictionary;
}
