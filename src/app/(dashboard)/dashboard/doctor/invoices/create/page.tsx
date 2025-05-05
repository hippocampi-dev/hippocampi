export const dynamic = "force-dynamic"

import { Suspense } from "react";
import CreateInvoiceForm from "~/components/doctor-dashboard/DoctorInvoiceForm";
import Loading from "~/components/loading/page";
import { getStripeConsultationPriceID } from "~/env";
import { getPatientDict, getPatients } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";
import { stripe } from "~/utilities/stripe";

export default async function CreateInvoicePage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateInvoiceContainer />
    </Suspense>
  );
}

async function CreateInvoiceContainer() {
  const doctorId = await getUserId() as "string";
  const patients = await getPatients(doctorId);
  const patientDict = await getPatientDict(doctorId);

  const price = await stripe.prices.retrieve(getStripeConsultationPriceID());

  return (
    <CreateInvoiceForm
      price={price.unit_amount?.toString()!}
      patients={patients}
      patientDict={patientDict}
    />
  )
}