export const dynamic = "force-dynamic"

import { Suspense } from "react";
import DoctorInvoices from "~/components/doctor-dashboard/DoctorInvoices";
import Loading from "~/components/loading/page";

export default function InvoicesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <InvoicesContainer />
    </Suspense>
  );
}

async function InvoicesContainer() {
  return (
    <DoctorInvoices />
  )
}