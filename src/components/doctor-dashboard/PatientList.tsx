import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { PatientsInterface } from "~/server/db/type"
import { getPatientDoctorManagement, getPatients } from "~/server/db/queries"
import { getUserId } from "~/utilities/getUser"

export async function PatientList() {
  const id = await getUserId() as "string";
  const patients = await getPatients(id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.map((patient) => (
            <PatientItem patient={patient} key={patient.patientId}/>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PatientItemProps {
  patient: PatientsInterface
}

async function PatientItem({ patient }: PatientItemProps) {
  const management = await getPatientDoctorManagement(patient.patientId as "string");
  return (
    <li key={patient.patientId} className="flex items-center space-x-4">
      <Avatar>
        <AvatarFallback>
          {`${patient.firstName[0]}${patient.lastName[0]}`}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{`${patient.firstName} ${patient.lastName}`}</p>
        <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
        <p className="text-sm text-muted-foreground">Last Visit: {management?.lastVisit}</p>
      </div>
    </li>
  )
}
