import { convertDateStringToDate } from "~/lib/utils";
import { addMedications } from "~/server/db/queries";
import { PatientMedicationsInterface } from "~/server/db/type";

// Expecting the incoming JSON to be an array of medication objects.
export const POST = async (request: Request) => {
  try {
    const rawBody = await request.json();
    console.log("Raw medications data:", rawBody);
    const patientId = rawBody.patientId;
    // Iterate through each medication and convert date strings.
    const medications: PatientMedicationsInterface = rawBody.medications.map((med: any) => {
      const {start_date, end_date, ...rest } = med;
      return {
        patientId,
        ...rest,
        startDate: med.start_date ? convertDateStringToDate(med.start_date) : null,
        endDate: med.end_date ? convertDateStringToDate(med.end_date):null,
      }
    });
    console.log(medications)
    const response = await addMedications(medications);

    if (!response) {
      return new Response(JSON.stringify("Error"), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in medications API:", error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
};
