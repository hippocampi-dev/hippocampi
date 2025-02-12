import { addCognitiveSymptoms } from "~/server/db/queries";
import { PatientCognitiveSymptomsInterface } from "~/server/db/type";

// pass in PatientCognitiveSymptomsInteface json
export const POST = async (request: Request) => {
  const body: PatientCognitiveSymptomsInterface = await request.json();
  
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