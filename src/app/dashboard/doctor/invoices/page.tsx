'use client'

import { useContext } from "react";
import { DoctorDashboardContext } from "~/app/context/DoctorDashboardContext";
import DoctorInvoices from "~/components/doctor-invoices/page"
import Loading from "~/components/loading/page";

export default function InvoicesPage() {
  const context = useContext(DoctorDashboardContext);

  if (!context || context.isLoading || !context.data) {
    return <Loading />
  }

  return (
    <DoctorInvoices
      invoices={context.data?.invoices!}
      patientDict={context?.data?.patientDict!}
    />
  )
}