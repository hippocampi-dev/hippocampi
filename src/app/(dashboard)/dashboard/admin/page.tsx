import { DoctorsPendingApproval } from "~/components/admin-dashboard/DoctorsPendingApproval"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { getPendingDoctorCredentials } from "~/server/db/queries"

export default async function Dashboard() {
  const dict = await getPendingDoctorCredentials();

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage and approve doctor credentials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctors Pending Approval</CardTitle>
          <CardDescription>Review and approve doctor credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <DoctorsPendingApproval dict={dict} />
        </CardContent>
      </Card>
    </div>
  )
}