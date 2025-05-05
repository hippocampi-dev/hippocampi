export const dynamic = "force-dynamic"

import { Suspense } from "react";
import Loading from "~/components/loading/page";
import PatientInvoices from "~/components/patient-dashboard/PatientInvoices";
import { getStripeConsultationPriceID } from "~/env";
import { getInvoiceDict, getInvoices } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";
import { stripe } from "~/utilities/stripe";

export default function InvoicesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <InvoicesContainer />
    </Suspense>
  );
}

async function InvoicesContainer() {
  const doctorId = await getUserId() as "string";
  const invoices = await getInvoices(doctorId);
  const appointmentInvoiceDict = await getInvoiceDict(doctorId);

  const price = await stripe.prices.retrieve(getStripeConsultationPriceID()!);

  return (
    <PatientInvoices
      invoices={invoices}
      appointmentInvoiceDict={appointmentInvoiceDict}
    />
  );
}