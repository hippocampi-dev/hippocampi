"use client"

import { Calendar, FileText, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { AppointmentsInterface, PatientHealthInformationInterface, PatientsInterface } from "~/server/db/type"
import BackButton from "../buttons/BackButton"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { AppointmentForm } from "./DoctorAppointmentForm"
import { useState } from "react"

interface PatientDetailsProps {
  patientId: "string"
  patient: PatientsInterface
  healthInfo: PatientHealthInformationInterface
  appointments: AppointmentsInterface[]
  patients: PatientsInterface[]
}

export default function PatientDetails({
  patientId,
  patient,
  healthInfo,
  appointments,
  patients
}: PatientDetailsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleScheduleAppointment = async () => {
    setIsDialogOpen(false);
  };

  const handleCancelAppointment = () => {
    setIsDialogOpen(false);
  };

  return (<div className="p-6 space-y-6">
    <BackButton />

    <div className="flex items-center space-x-4 justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-2xl">
            {`${patient.firstName[0]}${patient.lastName[0]}`}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{`${patient?.firstName} ${patient?.lastName}`}</h1>
          <p className="text-xl text-muted-foreground">Patient ID: {patientId}</p>
        </div>
      </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Appointment</DialogTitle>
            <AppointmentForm
              // patientId={selectPatient()?.patientId}
              patients={patients}
              onSchedule={handleScheduleAppointment}
              onCancel={handleCancelAppointment}
            />
          </DialogContent>
        </Dialog>
    </div>

    <div className="grid gap-6 md:group-cols-2">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            <User className="inline-block mr-2" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-medium">Age</dt>
              <dd>{patient?.age}</dd>
            </div>
            <div>
              <dt className="font-medium">Date of Birth</dt>
              <dd>{`${new Date(patient?.dateOfBirth!).toLocaleDateString()}`}</dd>
            </div>
            <div>
              <dt className="font-medium">Email</dt>
              <dd>{patient?.email}</dd>
            </div>
            <div>
              <dt className="font-medium">Phone</dt>
              <dd>{patient?.phoneNumber}</dd>
            </div>
            <div className="col-span-2">
              <dt className="font-medium">Address</dt>
              <dd>{`${patient?.streetAddress}, ${patient?.city}, ${patient?.state} ${patient?.zipCode}`}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FileText className="inline-block mr-2" /> Medical History
          </CardTitle>
        </CardHeader>
        <CardContent>
          { healthInfo.medicalHistory &&
            <ul className="space-y-4">
              <li>
                <p className="font-medium">Existing Diagnoses</p>
                <p className="text-sm text-muted-foreground">{healthInfo.medicalHistory.existingDiagnoses}</p>
              </li>
              <li>
                <p className="font-medium">Family History of Neurological Disorders</p>
                <p className="text-sm text-muted-foreground">{healthInfo.medicalHistory.familyHistoryOfNeurologicalDisorders}</p>
              </li>
              <li>
                <p className="font-medium">History of Chemotherapy or Radiation Therapy</p>
                <p className="text-sm text-muted-foreground">{healthInfo.medicalHistory.historyOfChemotherapyOrRadiationTherapy}</p>
              </li>
            </ul>
          }
        </CardContent>
      </Card>
      

      {/* Cognitive Symptoms */}<Card>
      <CardHeader>
        <CardTitle>
          <FileText className="inline-block mr-2" /> Cognitive Symptoms
        </CardTitle>
      </CardHeader>
      <CardContent>
          <ul className="space-y-4">
            {healthInfo.cognitiveSymptoms.map((item, index) => (
              <>
              <li>
                <p className="font-medium">Type</p>
                <p className="text-sm text-muted-foreground">{item.symptomType}</p>
              </li>
              <li>
                <p className="font-medium">Severity Level</p>
                <p className="text-sm text-muted-foreground">{item.severityLevel}</p>
              </li>
              <li>
                <p className="font-medium">Onset Date</p>
                <p className="text-sm text-muted-foreground">{new Date(item.onsetDate!).toLocaleDateString()}</p>
              </li>
              <li>
                <p className="font-medium">Notes</p>
                <p className="text-sm text-muted-foreground">{item.notes}</p>
              </li>
              </>
            ))}
          </ul>
        {healthInfo.cognitiveSymptoms && <ul className="space-y-4">
            </ul>
        }
      </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FileText className="inline-block mr-2" /> Allergies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {healthInfo.allergies.map((item, index) => (
              <li key={index}>
                <p className="font-medium">
                  {item.allergen}: {item.severityLevel}
                </p>
                <p className="text-sm text-muted-foreground">{item.reactionDescription}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Medication */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FileText className="inline-block mr-2" /> Medication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {healthInfo.medications.map((item, index) => (
              <li key={index}>
                <p className="font-medium">
                  {item.medicationName}
                </p>
                <p className="text-sm text-muted-foreground">{"Dosage:" + item.dosage}</p>
                <p className="text-sm text-muted-foreground">{"Frequency:" + item.frequency}</p>
                <p className="text-sm text-muted-foreground">{`${item.startDate}-${item.endDate}`}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Treatments */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FileText className="inline-block mr-2" /> Treatments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {healthInfo.treatments.map((treatment, index) => (
              <li key={index}>
                <p className="font-medium">
                  {treatment.treatmentName}
                </p>
                <p className="text-sm text-muted-foreground">{treatment.notes}</p>
                <p className="text-sm text-muted-foreground">{`${treatment.start_date}-${treatment.endDate}`}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Calendar className="inline-block mr-2" /> Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {appointments?.map((appointment, index) => (
              <li key={index}>
                <p className="font-medium">
                  {appointment.scheduledAt.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
  )
}