import { Calendar, FileText, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { getAllergies, getAppointments, getMedicalHistory, getMedications, getPatient, getPatients, getTreatments } from "~/server/db/queries"
import BackButton from "~/components/buttons/BackButton"
import ScheduleAppointmentButton from "../buttons/ScheduleAppointmentButton"

interface PatientDetailsProps {
  patientId: "string"
  doctorId: "string"
}

export default async function PatientDetails({ patientId, doctorId }: PatientDetailsProps) {
  const patient = await getPatient(patientId);
  const medicalHistory = await getMedicalHistory(patientId);
  const allergies = await getAllergies(patientId);
  const medications = await getMedications(patientId);
  const treatments = await getTreatments(patientId);
  const appointments = await getAppointments(patientId);

  const patients = await getPatients(doctorId);

  return (
    <div className="p-6 space-y-6">
      <BackButton />

      <div className="flex items-center space-x-4 justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {`${patient?.firstName} ${patient?.lastName}`}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{`${patient?.firstName} ${patient?.lastName}`}</h1>
            <p className="text-xl text-muted-foreground">Patient ID: {patientId}</p>
          </div>
        </div>
        <ScheduleAppointmentButton patients={patients} />
      </div>

      <div className="grpatientId gap-6 md:grpatientId-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              <User className="inline-block mr-2" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grpatientId grpatientId-cols-2 gap-4">
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
            <ul className="space-y-4">
              <li>
                <p className="font-medium">Existing Diagnoses</p>
                <p className="text-sm text-muted-foreground">{medicalHistory?.existingDiagnoses}</p>
              </li>
              <li>
                <p className="font-medium">Family History of Neurological Disorders</p>
                <p className="text-sm text-muted-foreground">{medicalHistory?.familyHistoryOfNeurologicalDisorders}</p>
              </li>
              <li>
                <p className="font-medium">History of Chemotherapy or Radiation Therapy</p>
                <p className="text-sm text-muted-foreground">{medicalHistory?.historyOfChemotherapyOrRadiationTherapy}</p>
              </li>
            </ul>
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
              {allergies.map((item, index) => (
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
              {medications.map((item, index) => (
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
              {treatments.map((treatment, index) => (
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