
// app/my-information/page.tsx
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { auth } from "~/server/auth";
import { getPatient, getPatientHealthInformation } from "~/server/db/queries";
import type { UserIdInterface, PatientHealthInformationInterface } from "~/server/db/type";
import { getUserId } from "~/utilities/getUser";
import {PatientInfoSections, InfoItem} from "~/components/patient-dashboard/PatientsInfoSections";
// For a server component, you might use your own session retrieval logic.
// For this example, we'll assume a function getUserId() returns the current user ID.

  
  
export default async function MyInformationPage() {
  const userId = await getUserId() as "string";
  if (!userId) {
    notFound();
  }

  // Fetch basic patient record
  const patient = await getPatient(userId);
  // Fetch additional health information
  const healthInfo = await getPatientHealthInformation(userId);
  console.log(healthInfo)

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
    <div className="container mx-auto p-4 space-y-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Information</h1>
      </header>

      {/* Personal Information */}
      <Card className="overflow-hidden shadow-md">
      {/* Clickable header */}
      <Link href="/dashboard/patient/my-information/personal-information" className="block">
        <Button
          variant="ghost"
          className="w-full justify-between rounded-none border-b px-6 py-5 text-left hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200"
        >
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
      </Link>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-8">
          {/* Left column */}
          <div className="space-y-4">
            <InfoItem label="Name">
              {patientInfo.patient.firstName} {patientInfo.patient.lastName}
              {patientInfo.patient.middle_initial && ` (${patientInfo.patient.middle_initial})`}
            </InfoItem>

            <InfoItem label="Date of Birth">{new Date(patientInfo.patient.dateOfBirth).toLocaleDateString()}</InfoItem>

            <InfoItem label="Age">{patientInfo.patient.age}</InfoItem>

            <InfoItem label="Gender">{patientInfo.patient.gender}</InfoItem>

            <InfoItem label="Condition">{patientInfo.patient.condition || "N/A"}</InfoItem>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <InfoItem label="Primary Language">{patientInfo.patient.primaryLanguage}</InfoItem>

            <InfoItem label="Phone Number">{patientInfo.patient.phoneNumber}</InfoItem>

            <InfoItem label="Email">{patientInfo.patient.email}</InfoItem>

            <InfoItem label="Address">
              {patientInfo.patient.streetAddress}, {patientInfo.patient.city}, {patientInfo.patient.state}{" "}
              {patientInfo.patient.zipCode}
            </InfoItem>

            <InfoItem label="HIPAA Compliance">
              <span
                className={
                  patientInfo.patient.hipaaCompliance ? "text-green-600 font-medium" : "text-amber-600 font-medium"
                }
              >
                {patientInfo.patient.hipaaCompliance ? "Agreed" : "Not Agreed"}
              </span>
            </InfoItem>
          </div>
        </div>
      </CardContent>
    </Card>
    <PatientInfoSections patientInfo = {patientInfo}></PatientInfoSections>
      
    </div>
  );
}

