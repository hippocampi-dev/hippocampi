import { Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'


export default function PatientNotifications() {
return (
    <div className="col-span-2 flex flex-col overflow-hidden">
        <Card className="flex-1 overflow-hidden">
        <CardHeader>
            <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto">
            <ul className="space-y-4">
                <p>PatientNotifications.tsx</p>
            {/** */}
            </ul>
        </CardContent>
        </Card>
    </div>
    )
}