"use client"
import { loadStripe } from "@stripe/stripe-js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { getStripeConsultationProductID, getStripePublishableKey } from "~/env";
import { AppointmentInvoiceDict, InvoicesInterface } from "~/server/db/type"

interface props {
  invoices: InvoicesInterface[],
  appointmentInvoiceDict: AppointmentInvoiceDict
}

const stripePromise = loadStripe(getStripePublishableKey()!);

export default function PatientInvoices({ invoices, appointmentInvoiceDict }: props) {
  const handleCheckout = async (id: string) => {
    const stripe = await stripePromise;
    
    try {
      const { sessionId } = await fetch('/api/stripe/create-checkout-sessions/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          priceId: getStripeConsultationProductID()
        }),
      }).then(res => res.json());

      const result = await stripe!.redirectToCheckout({ sessionId });
      
      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-2">Invoices</h1>
      <Table>
        <TableHeader>
          <TableRow>
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
              onClick={() => invoice.status === 'paid' ? null : handleCheckout(invoice.id!)}
              className={`cursor-pointer ${invoice.status === 'paid' ? 'opacity-50 pointer-events-none' : ''}`}
            >
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