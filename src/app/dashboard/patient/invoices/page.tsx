'use client'

import { useEffect, useState } from "react";
import { AppointmentInvoiceDict, createAppointmentInvoiceDictionary } from "~/app/context/DoctorDashboardContext";
import Loading from "~/components/loading/page";
import PatientInvoices from "~/components/patient-invoices/page";
import { InvoicesInterface } from "~/server/db/type";

interface Params {
  invoices: InvoicesInterface[];
  appointmentInvoiceDict: AppointmentInvoiceDict;
}

export default function Invoices() {
  const [params, setParams] = useState<Params | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both resources concurrently
        const [invoicesResponse, appointmentsResponse] = await Promise.all([
          fetch('/api/db/management/invoices/get'),
          fetch('/api/db/management/appointments/get')
        ]);

        // Parse responses
        const invoicesData = await invoicesResponse.json();
        const appointmentsData = await appointmentsResponse.json();

        // Create dictionary and update state
        const appointmentInvoiceDict = createAppointmentInvoiceDictionary(
          appointmentsData.response,
          invoicesData.response
        );

        setParams({
          invoices: invoicesData.response,
          appointmentInvoiceDict
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!params) {
    return (
      <main className="w-screen h-screen">
        <Loading />
      </main>
    );
  }

  return (
    <PatientInvoices
      invoices={params.invoices}
      appointmentInvoiceDict={params.appointmentInvoiceDict}
    />
  );
}