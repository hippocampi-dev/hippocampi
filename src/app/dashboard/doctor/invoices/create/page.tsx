import InvoiceForm from "~/components/doctor-dashboard/DoctorInvoiceForm";
import { getPatientDict, getPatients } from "~/server/db/queries";
import { getUserId } from "~/utilities/get-user";

export default async function CreateInvoicePage() {
  const doctorId = await getUserId() as "string";
  const patients = await getPatients(doctorId);
  const patientDict = await getPatientDict(doctorId);
  return (
    <InvoiceForm
      patients={patients}
      patientDict={patientDict}
    />
  )
}