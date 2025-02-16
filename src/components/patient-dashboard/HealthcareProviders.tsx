import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { getDoctor, getPatientDoctorManagement } from '~/server/db/queries';
import { getUserId } from '~/utilities/get-user';
import { Button } from '../ui/button';
import Link from 'next/link';



export default async function HealthcareProviders() {
    const userId = await getUserId() as "string";
    const response = await getPatientDoctorManagement(userId);
    response.forEach(function(element) {
        console.log(element)
    })

    return (
        <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Healthcare Providers</CardTitle>
                </CardHeader>
                <CardContent>
                <div>
                    {(!response || response.length === 0 || !response.some(record => record.doctorId)) ? (
                        <div className="flex flex-col items-center space-y-4">
                        <p className="text-lg text-gray-600">No assigned doctor</p>
                        <Link href = "/dashboard/patient/select-doctor">
                            <Button>Select Doctor</Button>
                        </Link>
                        </div>
                    ) : (
                        response.map((record) => (
                        <div key={record.doctorId} className="flex items-center space-x-4">
                            <p className="font-medium">Doctor ID: {record.doctorId}</p>
                            {/* Render additional doctor details here if available */}
                        </div>
                        ))
                    )}
                    </div>
                </CardContent>
              </Card>
    )
}