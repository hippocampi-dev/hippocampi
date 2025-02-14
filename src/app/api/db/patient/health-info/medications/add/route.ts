import { convertDateStringToDate } from "~/lib/utils";
import { addMedications } from "~/server/db/queries";
import { PatientMedicationsInterface } from "~/server/db/type";

// pass in PatientMedicationsInteface json
export const POST = async (request: Request) => {
  const rawBody = await request.json();
    
    // Convert the dateOfBirth string to a Date object
    const startDate = convertDateStringToDate(rawBody.startDate);
    const endDate = convertDateStringToDate(rawBody.endDate);
    const body: PatientMedicationsInterface = {
      ...rawBody,
      startDate,
      endDate // now a Date object
    };
  try {
    const response = await addMedications(body);

    if (!response) {
      return Response.json("Error");
    }

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};