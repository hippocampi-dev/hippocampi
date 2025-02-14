import { convertDateStringToDate } from "~/lib/utils";
import { addCognitiveSymptoms } from "~/server/db/queries";
import { PatientCognitiveSymptomsInterface } from "~/server/db/type";

// pass in PatientCognitiveSymptomsInteface json
export const POST = async (request: Request) => {
  const rawBody = await request.json();
      
      // Convert the dateOfBirth string to a Date object
      const onsetDate = convertDateStringToDate(rawBody.onsetDate);
      const body: PatientCognitiveSymptomsInterface = {
        ...rawBody,
        onsetDate // now a Date object
      };
  try {
    const response = await addCognitiveSymptoms(body);

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