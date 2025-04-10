export const dynamic = "force-dynamic"

import { Suspense } from "react";
import Loading from "~/components/loading/page";
import PatientInvoices from "~/components/patient-dashboard/PatientInvoices";
import { getInvoiceDict, getInvoices } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

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

  return (
    <PatientInvoices
      invoices={invoices}
      appointmentInvoiceDict={appointmentInvoiceDict}
    />
  );
}