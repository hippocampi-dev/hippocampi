// this is where we'll have our query functions for the db

import { ilike, or, count, and, sql } from "drizzle-orm"; // Assuming these helpers are available
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
  cognitiveAssessmentInterface,
  ConversationDict,
  DoctorAvailabilitiesInterface,

  // Add the missing import here
} from "./type";
import { db } from ".";
import { desc, asc } from "drizzle-orm";
import { CredentialsInterface } from "~/app/(dashboard)/onboarding/credentials/page";

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
    .set({
      ...patient,
      updated_at: sql`NOW()`
    })
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
    .set({
      ...doctor,
      updated_at: sql`NOW()`
    })
    .where(eq(schema_doctor.doctors.doctorId, user_id))
    .returning();
};

// get doctor
export const getDoctor = async (user_id: UserIdInterface) => {
  return db.query.doctors.findFirst({
    where: eq(schema_doctor.doctors.doctorId, user_id),
  });
};


export const fetchFilteredDoctors = async (
  specialization: string,
  term: string,
  currentPage: number
) => {
  const offset = (currentPage - 1) * 6;

  try {
    const filteredDoctors = await db.query.doctors.findMany({
      where:
        specialization
          ? and(
              eq(schema_doctor.doctors.specialization, specialization),
              or(
                ilike(schema_doctor.doctors.firstName, `%${term}%`),
                ilike(schema_doctor.doctors.lastName, `%${term}%`),
                ilike(schema_doctor.doctors.email, `%${term}%`),
                // ilike(schema_doctor.doctors.location, `%${term}%`)
              )
            )
          : or(
              ilike(schema_doctor.doctors.firstName, `%${term}%`),
              ilike(schema_doctor.doctors.lastName, `%${term}%`),
              ilike(schema_doctor.doctors.email, `%${term}%`),
              ilike(schema_doctor.doctors.specialization, `%${term}%`),
              // ilike(schema_doctor.doctors.location, `%${term}%`)
            ),
      limit: 6,
      offset: offset,
    });
    return filteredDoctors;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch doctors.");
  }
};

export async function fetchDoctorsPages(query: string) {
  try {
    const result = await db
      .select({ total: count(schema_doctor.doctors.doctorId) })
      .from(schema_doctor.doctors)
      .where(
        or(
          ilike(schema_doctor.doctors.firstName, `%${query}%`),
          ilike(schema_doctor.doctors.lastName, `%${query}%`),
          ilike(schema_doctor.doctors.email, `%${query}%`),
          ilike(schema_doctor.doctors.specialization, `%${query}%`),
          // ilike(schema_doctor.doctors.location, `%${query}%`)
        )
      );

    const total = result[0]?.total as number;
    const totalPages = Math.ceil(total / 6);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of doctors.");
  }
}

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
    .set({
      ...doctorCredential,
      updated_at: sql`NOW()`
    })
    .where(eq(schema_doctor.doctorCredentials.doctorId, user_id))
    .returning();
};

export const setDoctorCredentialLinks  = async (
  user_id: UserIdInterface,
  credentialLinks: CredentialsInterface
) => {
  return db
    .update(schema_doctor.doctorCredentials)
    .set({
      files: credentialLinks,
      updated_at: sql`NOW()`
    })
    .where(eq(schema_doctor.doctorCredentials.doctorId, user_id))
    .returning();
}

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
  console.log("Meeting is scheduled at " + meeting.scheduledAt);
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

// update appointment status
export const updateAppointmentStatus = async (
  appointment_id: string,
  status: "Scheduled" | "Completed" | "Canceled" | "No-Show"
) => {
  const dateToStore = new Date().toISOString();
  if (isNaN(Date.parse(dateToStore))) {
    console.log("Invalid date");
    throw new Error('Invalid date');
  }
  const currentAppointment = await getAppointment(appointment_id);
  
  if (!currentAppointment || !currentAppointment.patientId || !currentAppointment.doctorId) {
    throw new Error('Invalid appointment data: missing required fields');
  }

  const addingAppointment: AppointmentsInterface = {
    ...currentAppointment,
    patientId: currentAppointment.patientId,
    doctorId: currentAppointment.doctorId,
    status,
    scheduledAt: dateToStore,
  }
  return db
    .insert(schema_management.appointments)
    .values(addingAppointment)
    .onConflictDoNothing()
    .returning();
  // await db
  // .update(schema_management.appointments)
  // .set({ status, scheduledAt: dateToStore })
  // .where(eq(schema_management.appointments.id, appointment_id))
  // .returning();
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
    .set({
      ...allergy,
      updated_at: sql`NOW()`
    })
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
    .set({
      ...cognitiveSymptom,
      updated_at: sql`NOW()`
    })
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
    .set({
      ...dianosis,
      updated_at: sql`NOW()`
    })
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
    .set({
      ...emergencyContact,
      updated_at: sql`NOW()`
    })
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
    .set({
      ...medication,
      updated_at: sql`NOW()`
    })
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
    .set({
      ...treatment,
      updated_at: sql`NOW()`
    })
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
    .set({
      ...medicalHistory,
      updated_at: sql`NOW()`
    })
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
  const _cognitiveSymptoms = await db.query.cognitiveSymptoms.findMany({
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
    cognitiveSymptoms: _cognitiveSymptoms,
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
    .set({
      ...subscription,
      updated_at: sql`NOW()`
    })
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
    .set({
      ...invoice,
      updated_at: sql`NOW()`
    })
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
) => {
  const conversation = await db.query.conversations.findMany({
    where:
      eq(schema_message.conversations.patientId, patientId) &&
      eq(schema_message.conversations.doctorId, doctorId),
  });
  return conversation ?? null;
};

export const getTargetConversation = async (conversation_id: string) => {
  const conversation = await db.query.conversations.findFirst({
    where:
      eq(schema_message.conversations.conversationId, conversation_id)
  });
  return conversation;
};

export const getConversations = async (userId: string) => {
  const role = await getUserRole(userId as "string");

  if (role?.userRole === 'patient') {
    const conversationsWithDoctors =  await db.query.conversations.findMany({
      where: eq(schema_message.conversations.patientId, userId)
    });

    return conversationsWithDoctors;
  }
  if (role?.userRole === 'doctor') {
    const conversationsWithPateints =  await db.query.conversations.findMany({
      where: eq(schema_message.conversations.doctorId, userId),
    });

    return conversationsWithPateints;
  }
  return [];
};

export const getConversationDict = async (userId: string) => {
  const conversations = await getConversations(userId);
  const userRole = await getUserRole(userId as "string");
  const dict: ConversationDict = {};
  const isDoctor = userRole?.userRole === 'doctor'; // is the current user a doctor

  for (const c of conversations) {
    const lastMessage = await db.query.messages.findMany({
      orderBy: [desc(schema_message.messages.created_at)],
      where: eq(schema_message.messages.conversationId, c.conversationId),
      limit: 1,
    });
    const lastMessageUserRole = await getUserRole(lastMessage[0]?.senderId as "string");
    const lastMessageUser = lastMessageUserRole?.userRole === 'patient' ? await getPatient(lastMessage[0]?.senderId as "string") : await getDoctor(lastMessage[0]?.senderId as "string");

    dict[c.conversationId] = {
      conversation: c,
      lastMessage: lastMessage[0],
      lastMessageUser: lastMessageUser
    }
  }
  return dict;
}

export const getDoctorAvailabilities = async(doctorId: string) => {
  const doctorAvailabilities = await db.query.doctorAvailabilities.findMany({
    where: eq(schema_doctor.doctorAvailabilities.doctorId, doctorId)
  })
  return doctorAvailabilities;
}

export const checkOverlappingAvailability = async(doctorId: string, dayOfWeek: string, startTime: string, endTime: string) => {
  const availabilities = await getDoctorAvailabilities(doctorId);
  // Filter availabilities by day
  const sameDayAvailabilities = availabilities.filter(a => a.dayOfWeek === dayOfWeek);
  
  if (sameDayAvailabilities.length === 0) return null;
  console.log("sameDayAvailabilities", sameDayAvailabilities)
  // Check for overlaps
  for (const availability of sameDayAvailabilities) {
    console.log('availability', availability)
    // Convert times to minutes for easier comparison
    const newStartMinutes = convertTimeToMinutes(startTime);
    const newEndMinutes = convertTimeToMinutes(endTime);
    const existingStartMinutes = convertTimeToMinutes(availability.startTime);
    const existingEndMinutes = convertTimeToMinutes(availability.endTime);
    console.log("hi" + newStartMinutes, newEndMinutes, existingStartMinutes, existingEndMinutes) 
    // Check for overlap
    if (
      (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
      (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
      (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
    ) {
      console.log("overlapped?")
      return {
        overlap: true,
        existingTime: formatTimeWithAMPM(availability.startTime) + " - " + formatTimeWithAMPM(availability.endTime)
      };
    }
  }
  
  return null;
}

// Helper function to convert HH:MM to minutes
const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  if ((hours)==null || (minutes)==null) {
    throw new Error(`Invalid time format: ${time}`);
  }
  return hours * 60 + minutes;
};

// Helper function to format time with AM/PM
export const formatTimeWithAMPM = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  if ((hours)==null || (minutes)==null) {
    throw new Error(`Invalid time format: ${time}`);
  }
  const period = hours >= 12 ? 'PM' : 'AM';
  
  // Convert hours for 12-hour format display
  let displayHours = hours % 12;
  if (displayHours === 0) displayHours = 12; // Convert 0 to 12 for display
  
  // Format string with special indications for noon and midnight
  let formattedTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  
  // Add clarity for specific times - optional, remove if it clutters the UI
  if (hours === 0 && minutes === 0) formattedTime += " (Midnight)";
  if (hours === 12 && minutes === 0) formattedTime += " (Noon)";
  
  return formattedTime;
};

export const addDoctorAvailabilities = async(availability: DoctorAvailabilitiesInterface) => {
  // Check for overlapping availabilities before adding
  const overlap = await checkOverlappingAvailability(
    availability.doctorId, 
    availability.dayOfWeek, 
    availability.startTime,
    availability.endTime
  );
  
  if (overlap) {
    throw new Error(`Overlaps with existing availability at ${overlap.existingTime}`);
  }
  
  return db.insert(schema_doctor.doctorAvailabilities).values(availability).onConflictDoNothing().returning();
}

export const deleteDoctorAvailability = async(availabilityId: string, doctorId: string) => {
  // First check if this availability belongs to the doctor making the request
  const availability = await db.query.doctorAvailabilities.findFirst({
    where: and(
      eq(schema_doctor.doctorAvailabilities.recurringId, availabilityId),
      eq(schema_doctor.doctorAvailabilities.doctorId, doctorId)
    ),
  });
  
  if (!availability) {
    throw new Error("Availability not found or you don't have permission to delete it");
  }
  
  return db.delete(schema_doctor.doctorAvailabilities)
    .where(eq(schema_doctor.doctorAvailabilities.recurringId, availabilityId))
    .returning();
}

export const createConversation = async (conversation: ConversationsInterface) => {
  return db
    .insert(schema_message.conversations)
    .values(conversation)
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

export const createMessage = async (message: MessagesInterface) => {
  return db
    .insert(schema_message.messages)
    .values(message)
    .returning();
};

export const setMessagesRead = async (conversationId: string, senderId: string) => {
  return db
    .update(schema_message.messages)
    .set({
      read: true,
      updated_at: sql`NOW()`
    })
    .where(
      and(
        eq(schema_message.messages.conversationId, conversationId),
        eq(schema_message.messages.senderId, senderId)
      )
    )
    .returning();
}

export const createAssessment = async (data: cognitiveAssessmentInterface) => {
  try {
    const result = await db.insert(schema_patient.cognitiveAssessments)
      .values(data)
      .returning();
    return result;
  } catch (error) {
    console.error("Failed to create assessment:", error);
    throw error;
  }
};

export const getAssessment = async (userId: UserIdInterface): Promise<cognitiveAssessmentInterface> => {
  try {
    const assessment = await db.query.cognitiveAssessments.findFirst({
      where: eq(schema_patient.cognitiveAssessments.patientId, userId)
    });
    if (!assessment) {
      throw new Error("Assessment not found");
    }
    return assessment;
  } catch (error) {
    console.error("Failed to get assessment", error);
    throw error;
  }
}



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


// get user
export const getUser = async (user_id: UserIdInterface) => {
  return db.query.users.findFirst({
    where: eq(schema_auth.users.id, user_id),
  });
};