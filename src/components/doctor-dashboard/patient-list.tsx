import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { PatientDoctorManagementInterface, PatientsInterface, UserIdInterface } from "~/server/db/type"
import { PatientDict } from "~/app/context/DoctorDashboardContext"

interface PatientListProps {
  patients: PatientsInterface[]
  patientDict: PatientDict
}

export function PatientList({ patients, patientDict }: PatientListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {patients.map((patient) => (
            <PatientItem
              patient={patient}
              patientDict={patientDict[patient.patientId]!.management}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

interface PatientItemProps {
  patient: PatientsInterface
  patientDict: PatientDoctorManagementInterface
}

function PatientItem({ patient, patientDict }: PatientItemProps) {
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
        <p className="text-sm text-muted-foreground">Last Visit: {patientDict.lastVisit}</p>
      </div>
    </li>
  )
}
