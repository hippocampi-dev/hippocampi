"use client"

import { useCallback, useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, FileText, User } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Textarea } from "~/components/ui/textarea"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { DoctorDashboardContext } from "~/app/context/DoctorDashboardContext"
import Loading from "~/components/loading/page"
import Error from "~/components/error/page"
import { AppointmentsInterface, PatientDoctorManagementInterface } from "~/server/db/type"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { AppointmentForm } from "~/components/doctor-dashboard/appointment-form"
import { useSession } from "next-auth/react"

interface PatientDetailsProps {
  id: string
}

export default function PatientDetails({ id }: PatientDetailsProps) {
  const router = useRouter()
  const context = useContext(DoctorDashboardContext);
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Callbacks
  const patientDict = context?.data?.patientDict![id];
  const selectBirthDate = useCallback(() => {
    return new Date(selectPatient()?.dateOfBirth!);
  }, [context?.data])
  const selectManagement = useCallback(() => {
    return patientDict?.management;
  }, [context?.data]);
  const selectPatient = useCallback(() => {
    return patientDict?.patient;
  }, [context?.data]);
  const selectHealthInfo = useCallback(() => {
    return patientDict?.healthInfo;
  }, [context?.data]);
  const selectMedicalHistory = useCallback(() => {
    return patientDict?.healthInfo.medicalHistory;
  }, [context?.data]);
  const selectAppointments = useCallback(() => {
    return context?.data?.appointments?.filter(
      (appointment): appointment is AppointmentsInterface => 
        appointment.patientId === id
    ) as AppointmentsInterface[];
  }, [context?.data]);

  if (!context || context.isLoading || !context.data) {
    return <Loading />
  }

  if (context.error) {
    return <Error />
  }

  const handleScheduleAppointment = async () => {
    setIsDialogOpen(false);
  };

  const handleCancelAppointment = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
      </Button>

      <div className="flex items-center space-x-4 justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {`${selectPatient()?.firstName} ${selectPatient()?.lastName}`}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{`${selectPatient()?.firstName} ${selectPatient()?.lastName}`}</h1>
            <p className="text-xl text-muted-foreground">Patient ID: {id}</p>
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
              patients={context.data.patients}
              onSchedule={handleScheduleAppointment}
              onCancel={handleCancelAppointment}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
                <dd>{selectPatient()?.age}</dd>
              </div>
              <div>
                <dt className="font-medium">Date of Birth</dt>
                <dd>{`${selectBirthDate().toLocaleDateString()}`}</dd>
              </div>
              <div>
                <dt className="font-medium">Email</dt>
                <dd>{selectPatient()?.email}</dd>
              </div>
              <div>
                <dt className="font-medium">Phone</dt>
                <dd>{selectPatient()?.phoneNumber}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-medium">Address</dt>
                <dd>{`${selectPatient()?.streetAddress}, ${selectPatient()?.city}, ${selectPatient()?.state} ${selectPatient()?.zipCode}`}</dd>
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
                <p className="text-sm text-muted-foreground">{selectMedicalHistory()?.existingDiagnoses}</p>
              </li>
              <li>
                <p className="font-medium">Family History of Neurological Disorders</p>
                <p className="text-sm text-muted-foreground">{selectMedicalHistory()?.familyHistoryOfNeurologicalDisorders}</p>
              </li>
              <li>
                <p className="font-medium">History of Chemotherapy or Radiation Therapy</p>
                <p className="text-sm text-muted-foreground">{selectMedicalHistory()?.historyOfChemotherapyOrRadiationTherapy}</p>
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
              {selectHealthInfo()?.allergies.map((item, index) => (
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
              {selectHealthInfo()?.medications.map((item, index) => (
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
              {selectHealthInfo()?.treatments.map((item, index) => (
                <li key={index}>
                  <p className="font-medium">
                    {item.treatmentName}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                  <p className="text-sm text-muted-foreground">{`${item.start_date}-${item.endDate}`}</p>
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
              {selectAppointments()?.map((appointment, index) => (
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

        {/* Notes */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Add new observations or notes about the patient</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={notes ? notes : ''}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleAddNote}>Update Notes</Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}