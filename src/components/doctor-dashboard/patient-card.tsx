import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Button } from "../ui/button"
import Link from "next/link"
import { getPatient, getPatientDoctorManagement } from "~/server/db/queries"

interface PatientCardProps {
  id: "string"
}

export async function PatientCard({ id, }: PatientCardProps) {
  const patient = await getPatient(id);
  const management = await getPatientDoctorManagement(id);

  if (!patient || !management) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarFallback>
          {`${patient.firstName[0]}${patient.lastName[0]}`}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{`${patient.firstName} ${patient.lastName}`}</CardTitle>
          <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="font-medium">Last Visit</dt>
            <dd>{management.lastVisit}</dd>
          </div>
          <div>
            <dt className="font-medium">Condition</dt>
            <dd>{patient.condition}</dd>
          </div>
          <div className="col-span-2">
            <dt className="font-medium">Email</dt>
            <dd className="truncate">{patient.email}</dd>
          </div>
          <Button asChild className="w-full mt-4">
            <Link href={`/dashboard/doctor/patients/${patient.patientId}`}>View Details</Link>
          </Button>
        </dl>
      </CardContent>
    </Card>
  )
}

