import PatientInvoices from "~/components/patient-dashboard/PatientInvoices";
import { getInvoiceDict, getInvoices } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export default async function Invoices() {
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