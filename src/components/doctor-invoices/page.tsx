import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { getInvoiceDict, getInvoices, getPatientDict } from "~/server/db/queries"
import { getUserId } from "~/utilities/get-user"

export default async function DoctorInvoices() {
  const doctorId = await getUserId() as "string";
  const invoices = await getInvoices(doctorId);
  const patientDict = await getPatientDict(doctorId);
  const appointmentInvoiceDict = await getInvoiceDict(doctorId);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-2">Invoices</h1>
      <Link href="/dashboard/doctor/invoices/create">
        <Button>Create New Invoice</Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Appointment</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Duration (hours)</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow 
              key={invoice.id}
              className={`cursor-pointer ${invoice.status === 'paid' ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <TableCell>{`${patientDict[invoice.patientId]?.patient.firstName} ${patientDict[invoice.patientId]?.patient.lastName}`}</TableCell>
              <TableCell>{new Date(appointmentInvoiceDict[invoice.id!]?.scheduledAt!).toLocaleString()}</TableCell>
              <TableCell>${invoice.hourlyRate}.00</TableCell>
              <TableCell>~60 min</TableCell>
              <TableCell>${process.env.NEXT_PUBLIC_HOURLY_RATE}.00</TableCell>
              <TableCell className="capitalize">{invoice.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}