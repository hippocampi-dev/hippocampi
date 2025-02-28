"use server";
import Link from "next/link";
// app/my-information/page.tsx
import { notFound } from "next/navigation";
import { auth } from "~/server/auth";
import { getPatient, getPatientHealthInformation } from "~/server/db/queries";
import type {
  UserIdInterface,
  PatientHealthInformationInterface,
} from "~/server/db/type";

// For a server component, you might use your own session retrieval logic.
// For this example, we'll assume a function getUserId() returns the current user ID.
async function getUserId(): Promise<UserIdInterface | null> {
  const session = await auth();
  return (session?.user.id ?? null) as UserIdInterface | null;
}

export default async function MyInformationPage() {
  const userId = await getUserId();
  if (!userId) {
    notFound();
  }

  // Fetch basic patient record
  const patient = await getPatient(userId);
  // Fetch additional health information
  const healthInfo = await getPatientHealthInformation(userId);
  if (!patient || !healthInfo) {
    notFound();
  }

  // Compose full patient info object.
  // (You may need to massage the data, e.g. convert date objects to strings.)
  const patientInfo: PatientHealthInformationInterface & { patient: any } = {
    patient: patient,
    emergencyContacts: healthInfo.emergencyContacts,
    treatments: healthInfo.treatments,
    medications: healthInfo.medications,
    allergies: healthInfo.allergies,
    diagnoses: healthInfo.diagnoses, // in case of a typo
    cognitiveSymptoms: healthInfo.cognitiveSymptoms,
    medicalHistory: healthInfo.medicalHistory,
  };

  return (
    <div className="container mx-auto space-y-10 p-4">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Information</h1>
      </header>

      {/* Personal Information */}

      <section className="rounded bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">Personal Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p>
              <strong>Name:</strong> {patientInfo.patient.firstName}{" "}
              {patientInfo.patient.lastName}
              {patientInfo.patient.middle_initial && (
                <> ({patientInfo.patient.middle_initial})</>
              )}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(patientInfo.patient.dateOfBirth).toLocaleDateString()}
            </p>
            <p>
              <strong>Age:</strong> {patientInfo.patient.age}
            </p>
            <p>
              <strong>Gender:</strong> {patientInfo.patient.gender}
            </p>
            <p>
              <strong>Condition:</strong>{" "}
              {patientInfo.patient.condition || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Primary Language:</strong>{" "}
              {patientInfo.patient.primaryLanguage}
            </p>
            <p>
              <strong>Phone Number:</strong> {patientInfo.patient.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {patientInfo.patient.email}
            </p>
            <p>
              <strong>Address:</strong> {patientInfo.patient.streetAddress},{" "}
              {patientInfo.patient.city}, {patientInfo.patient.state}{" "}
              {patientInfo.patient.zipCode}
            </p>
            <p>
              <strong>HIPAA Compliance:</strong>{" "}
              {patientInfo.patient.hipaaCompliance ? "Agreed" : "Not Agreed"}
            </p>
          </div>
        </div>
      </section>
      {/* Emergency Contacts */}
      {patientInfo.emergencyContacts.length > 0 && (
        <section className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">Emergency Contacts</h2>
          <ul className="space-y-4">
            {patientInfo.emergencyContacts.map((contact) => (
              <li key={contact.id} className="rounded border p-4">
                <p>
                  <strong>Name:</strong> {contact.firstName} {contact.lastName}
                </p>
                <p>
                  <strong>Relationship:</strong> {contact.relationship}
                </p>
                <p>
                  <strong>Phone:</strong> {contact.phoneNumber}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Treatments */}
      {patientInfo.treatments.length > 0 && (
        <section className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">Treatments</h2>
          <ul className="space-y-4">
            {patientInfo.treatments.map((treatment) => (
              <li key={treatment.id} className="rounded border p-4">
                <p>
                  <strong>Treatment:</strong> {treatment.treatmentName}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(treatment.start_date).toLocaleDateString()}
                </p>
                {treatment.endDate && (
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(treatment.endDate).toLocaleDateString()}
                  </p>
                )}
                {treatment.notes && (
                  <p>
                    <strong>Notes:</strong> {treatment.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Medications */}
      {patientInfo.medications.length > 0 && (
        <section className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">Medications</h2>
          <ul className="space-y-4">
            {patientInfo.medications.map((med) => (
              <li key={med.id} className="rounded border p-4">
                <p>
                  <strong>Medication:</strong> {med.medicationName}
                </p>
                <p>
                  <strong>Dosage:</strong> {med.dosage}
                </p>
                <p>
                  <strong>Frequency:</strong> {med.frequency}
                </p>
                {med.startDate && (
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(med.startDate).toLocaleDateString()}
                  </p>
                )}
                {med.endDate && (
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(med.endDate).toLocaleDateString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Allergies */}
      {patientInfo.allergies.length > 0 && (
        <section className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">Allergies</h2>
          <ul className="space-y-4">
            {patientInfo.allergies.map((allergy) => (
              <li key={allergy.id} className="rounded border p-4">
                <p>
                  <strong>Allergen:</strong> {allergy.allergen}
                </p>
                {allergy.reactionDescription && (
                  <p>
                    <strong>Reaction:</strong> {allergy.reactionDescription}
                  </p>
                )}
                {allergy.severityLevel && (
                  <p>
                    <strong>Severity:</strong> {allergy.severityLevel}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Diagnoses */}
      {patientInfo.diagnoses.length > 0 && (
        <section className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">Diagnoses</h2>
          <ul className="space-y-4">
            {patientInfo.diagnoses.map((diag) => (
              <li key={diag.id} className="rounded border p-4">
                <p>
                  <strong>Condition:</strong> {diag.conditionName}
                </p>
                <p>
                  <strong>Diagnosis Date:</strong>{" "}
                  {new Date(diag.diagnosisDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Self Reported:</strong>{" "}
                  {diag.selfReported ? "Yes" : "No"}
                </p>
                {diag.notes && (
                  <p>
                    <strong>Notes:</strong> {diag.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Cognitive Symptoms */}
      {patientInfo.cognitiveSymptoms.length > 0 && (
        <section className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">Cognitive Symptoms</h2>
          <ul className="space-y-4">
            {patientInfo.cognitiveSymptoms.map((cs) => (
              <li key={cs.id} className="rounded border p-4">
                <p>
                  <strong>Symptom Type:</strong> {cs.symptomType}
                </p>
                <p>
                  <strong>Onset Date:</strong>{" "}
                  {cs.onsetDate
                    ? new Date(cs.onsetDate).toLocaleDateString()
                    : "No Date Provided"}
                </p>
                {cs.severityLevel && (
                  <p>
                    <strong>Severity:</strong> {cs.severityLevel}
                  </p>
                )}
                {cs.notes && (
                  <p>
                    <strong>Notes:</strong> {cs.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Medical History */}
      {patientInfo.medicalHistory && (
        <section className="rounded bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-semibold">Medical History</h2>
          <div className="rounded border p-4">
            <p>
              <strong>Existing Diagnoses:</strong>{" "}
              {patientInfo.medicalHistory.existingDiagnoses}
            </p>
            <p>
              <strong>Family History of Neurological Disorders:</strong>{" "}
              {patientInfo.medicalHistory.familyHistoryOfNeurologicalDisorders}
            </p>
            <p>
              <strong>History of Chemo/Radiation Therapy:</strong>{" "}
              {
                patientInfo.medicalHistory
                  .historyOfChemotherapyOrRadiationTherapy
              }
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
