import Link from "next/link"
import { PatientDict } from "~/app/context/DoctorDashboardContext"
import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { InvoicesInterface } from "~/server/db/type"

interface props {
  invoices: InvoicesInterface[],
  patientDict: PatientDict
}

export default function DoctorInvoices({ invoices, patientDict }: props) {

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
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Duration (hours)</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{`${patientDict[invoice.patientId]?.patient.firstName} ${patientDict[invoice.patientId]?.patient.lastName}`}</TableCell>
              <TableCell>${invoice.hourlyRate}</TableCell>
              <TableCell>{invoice.duration}</TableCell>
              <TableCell>${invoice.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}