import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { AlertCircle, Calendar, Pill, Stethoscope, User, Brain, ChevronRight } from "lucide-react"

import type { PatientHealthInformationInterface } from "~/server/db/type"

export function PatientInfoSections({ patientInfo }: { patientInfo: PatientHealthInformationInterface }) {
  return (
    <div className="space-y-6">
      <EmergencyContactsCard contacts={patientInfo.emergencyContacts} />
      <TreatmentsCard treatments={patientInfo.treatments} />
      <MedicationsCard medications={patientInfo.medications} />
      <AllergiesCard allergies={patientInfo.allergies} />
      <DiagnosesCard diagnoses={patientInfo.diagnoses} />
      <CognitiveSymptomsCard symptoms={patientInfo.cognitiveSymptoms} />
      <MedicalHistoryCard history={patientInfo.medicalHistory} />
    </div>
  )
}

function EmergencyContactsCard({ contacts }: { contacts: PatientHealthInformationInterface['emergencyContacts'] }) {
  if (contacts.length === 0) return null

  return (
    <InfoCard title="Emergency Contacts" icon={User}>
      <ul className="space-y-4">
        {contacts.map((contact) => (
          <li key={contact.id} className="border rounded-lg p-4">
            <InfoItem label="Name">
              {contact.firstName} {contact.lastName}
            </InfoItem>
            <InfoItem label="Relationship">{contact.relationship}</InfoItem>
            <InfoItem label="Phone">{contact.phoneNumber}</InfoItem>
          </li>
        ))}
      </ul>
    </InfoCard>
  )
}

function TreatmentsCard({ treatments }: { treatments: PatientHealthInformationInterface['treatments'] }) {
  if (treatments.length === 0) return null

  return (
    <InfoCard title="Treatments" icon={Stethoscope}>
      <ul className="space-y-4">
        {treatments.map((treatment) => (
          <li key={treatment.id} className="border rounded-lg p-4">
            <InfoItem label="Treatment">{treatment.treatmentName}</InfoItem>
            <InfoItem label="Start Date">{new Date(treatment.start_date).toLocaleDateString()}</InfoItem>
            {treatment.endDate && (
              <InfoItem label="End Date">{new Date(treatment.endDate).toLocaleDateString()}</InfoItem>
            )}
            {treatment.notes && <InfoItem label="Notes">{treatment.notes}</InfoItem>}
          </li>
        ))}
      </ul>
    </InfoCard>
  )
}

function MedicationsCard({ medications }: { medications: PatientHealthInformationInterface['medications'] }) {
  if (medications.length === 0) return null

  return (
    <InfoCard title="Medications" icon={Pill}>
      <ul className="space-y-4">
        {medications.map((med) => (
          <li key={med.id} className="border rounded-lg p-4">
            <InfoItem label="Medication">{med.medicationName}</InfoItem>
            <InfoItem label="Dosage">{med.dosage}</InfoItem>
            <InfoItem label="Frequency">{med.frequency}</InfoItem>
            {med.startDate && <InfoItem label="Start Date">{new Date(med.startDate).toLocaleDateString()}</InfoItem>}
            {med.endDate && <InfoItem label="End Date">{new Date(med.endDate).toLocaleDateString()}</InfoItem>}
          </li>
        ))}
      </ul>
    </InfoCard>
  )
}

function AllergiesCard({ allergies }: {allergies: PatientHealthInformationInterface["allergies"]}) {
  if (allergies.length === 0) return null

  return (
    <InfoCard title="Allergies" icon={AlertCircle}>
      <ul className="space-y-4">
        {allergies.map((allergy) => (
          <li key={allergy.id} className="border rounded-lg p-4">
            <InfoItem label="Allergen">{allergy.allergen}</InfoItem>
            {allergy.reactionDescription && <InfoItem label="Reaction">{allergy.reactionDescription}</InfoItem>}
            {allergy.severityLevel && <InfoItem label="Severity">{allergy.severityLevel}</InfoItem>}
          </li>
        ))}
      </ul>
    </InfoCard>
  )
}

function DiagnosesCard({ diagnoses }: { diagnoses: PatientHealthInformationInterface['diagnoses'] }) {
  if (diagnoses.length === 0) return null

  return (
    <InfoCard title="Diagnoses" icon={Stethoscope}>
      <ul className="space-y-4">
        {diagnoses.map((diag) => (
          <li key={diag.id} className="border rounded-lg p-4">
            <InfoItem label="Condition">{diag.conditionName}</InfoItem>
            <InfoItem label="Diagnosis Date">{new Date(diag.diagnosisDate).toLocaleDateString()}</InfoItem>
            <InfoItem label="Self Reported">{diag.selfReported ? "Yes" : "No"}</InfoItem>
            {diag.notes && <InfoItem label="Notes">{diag.notes}</InfoItem>}
          </li>
        ))}
      </ul>
    </InfoCard>
  )
}

function CognitiveSymptomsCard({ symptoms }: {symptoms: PatientHealthInformationInterface['cognitiveSymptoms']}) {
  if (symptoms.length === 0) return null

  return (
    <InfoCard title="Cognitive Symptoms" icon={Brain}>
      <ul className="space-y-4">
        {symptoms.map((cs) => (
          <li key={cs.id} className="border rounded-lg p-4">
            <InfoItem label="Symptom Type">{cs.symptomType}</InfoItem>
            <InfoItem label="Onset Date">
              {cs.onsetDate ? new Date(cs.onsetDate).toLocaleDateString() : "No Date Provided"}
            </InfoItem>
            {cs.severityLevel && <InfoItem label="Severity">{cs.severityLevel}</InfoItem>}
            {cs.notes && <InfoItem label="Notes">{cs.notes}</InfoItem>}
          </li>
        ))}
      </ul>
    </InfoCard>
  )
}

function MedicalHistoryCard({ history }:{ history: PatientHealthInformationInterface['medicalHistory']}) {
  if (!history) return null

  return (
    <InfoCard title="Medical History" icon={Calendar}>
      <div className="border rounded-lg p-4">
        <InfoItem label="Existing Diagnoses">{history.existingDiagnoses}</InfoItem>
        <InfoItem label="Family History of Neurological Disorders">
          {history.familyHistoryOfNeurologicalDisorders}
        </InfoItem>
        <InfoItem label="History of Chemo/Radiation Therapy">
          {history.historyOfChemotherapyOrRadiationTherapy}
        </InfoItem>
      </div>
    </InfoCard>
  )
}

import { ReactNode } from "react";
import Link from "next/link"
import { Button } from "../ui/button"

function InfoCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
      {/* <Link href="/dashboard/patient/my-information/personal-information" className="block">
        <Button
          variant="ghost"
          className="w-full justify-between rounded-nonetext-left hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200"
        > */}
          <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
          {/* <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
      </Link> */}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-base">{children}</p>
      </div>
    )
  }
  