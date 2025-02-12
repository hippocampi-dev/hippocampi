import { addPatient } from "~/server/db/queries";
import { PatientsInterface } from "~/server/db/type";

// pass in PatientsInteface json
export const POST = async (request: Request) => {
  const body: PatientsInterface = await request.json();
  
  try {
    const response = await addPatient(body);

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