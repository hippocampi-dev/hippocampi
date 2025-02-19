import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { getDoctor, getPatientDoctorManagement } from '~/server/db/queries';
import { getUserId } from '~/utilities/get-user';
import { Button } from '../ui/button';
import Link from 'next/link';
import { UserIdInterface } from '~/server/db/type';



export default async function HealthcareProviders() {
    const userId = await getUserId() as "string";
    const patientDoctorRelations = await getPatientDoctorManagement(userId);
    const doctorIds = patientDoctorRelations.map((relation) => relation.doctorId);

    const doctors = await Promise.all(
        doctorIds.map((id) => getDoctor(id as UserIdInterface))
    );

    if (!doctors) return null;

    return (
        <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Healthcare Providers</CardTitle>
                </CardHeader>
                <CardContent>
                <div>
                    {(!doctors || doctors.length === 0) ? (
                        <div className="flex flex-col items-center space-y-4">
                        <p className="text-lg text-gray-600">No assigned doctor</p>
                        <Link href = "/dashboard/patient/select-doctor">
                            <Button>Select Doctor</Button>
                        </Link>
                        </div>
                    ) : (
                        <ul className="flex flex-col space-y-4">
                        {doctors.map((doctor) => doctor && (
                          <Link href = {`/dashboard/patient/doctors/${doctor.doctorId}`}>
                            <li key={doctor.doctorId} className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium">
                                  Dr. {doctor!.firstName} {doctor!.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {doctor!.specialization} | {doctor!.location}
                                </p>
                              </div>
                            </li>
                          </Link>
                        ))}
                      </ul>
                        

        
                    )}
                    </div>
                </CardContent>
              </Card>
    )
}