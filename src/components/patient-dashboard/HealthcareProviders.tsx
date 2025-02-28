import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { getDoctor, getAllPatientDoctorManagement } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";
import { UserIdInterface } from "~/server/db/type";
import MessageButton from "./MessageButton";

export default async function HealthcareProviders() {
  const userId = (await getUserId()) as "string";
  const patientDoctorRelations = await getAllPatientDoctorManagement(userId);
  const doctorIds = patientDoctorRelations.map((relation) => relation.doctorId);

  const doctors = await Promise.all(
    doctorIds.map((id) => getDoctor(id as UserIdInterface)),
  );

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Healthcare Providers</CardTitle>
      </CardHeader>
      <CardContent>
        {!doctors || doctors.length === 0 ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg text-gray-600">No assigned doctor</p>
            <Link href="/dashboard/patient/select-doctor">
              <Button>Select Doctor</Button>
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col space-y-6">
            {doctors.map((doctor) =>
              doctor ? (
                <li
                  key={doctor.doctorId}
                  className="rounded border p-4 shadow-md"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {doctor.specialization
                        ? doctor.specialization
                        : "General Practitioner"}{" "}
                      | {doctor.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ratings: {doctor.ratings ? doctor.ratings : "N/A"}
                    </p>
                    <p className="mt-2 text-gray-700">{doctor.bio}</p>
                  </div>
                  <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link
                        href={`https://placeholder.com/reviews/${doctor.doctorId}`}
                      >
                        Details
                      </Link>
                    </Button>
                    <Button variant="default" className="flex-1" asChild>
                      <MessageButton
                        doctorId={doctor.doctorId}
                        patientId={userId}
                      />
                    </Button>
                    <Button variant="default" className="flex-1" asChild>
                      <Link
                        href={`/dashboard/appointments/schedule?doctorId=${doctor.doctorId}`}
                      >
                        Schedule Appointment
                      </Link>
                    </Button>
                  </div>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
