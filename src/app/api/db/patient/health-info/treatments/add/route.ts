import { addTreatments } from "~/server/db/queries";
import { PatientTreatmentsInterface } from "~/server/db/type";

// pass in PatientTreatmentsInteface json
export const POST = async (request: Request) => {
  const body: PatientTreatmentsInterface = await request.json();
  
  try {
    const response = await addTreatments(body);

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