import { addAllergies } from "~/server/db/queries";
import { PatientAllergiesInterface } from "~/server/db/type";

// pass in PatientAllergiesInteface json
export const POST = async (request: Request) => {
  const body: PatientAllergiesInterface = await request.json();
  
  try {
    const response = await addAllergies(body);

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