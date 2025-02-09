import { addCaregivers } from "~/server/db/queries";
import { PatientCaregiversInterface } from "~/server/db/type";

// pass in PatientCaregiversInteface json
export const POST = async (request: Request) => {
  const body: PatientCaregiversInterface = await request.json();
  
  try {
    const response = await addCaregivers(body);

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