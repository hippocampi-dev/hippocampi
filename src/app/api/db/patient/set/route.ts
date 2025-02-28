import { setPatient } from "~/server/db/queries";
import { PatientsInterface } from "~/server/db/type";
import { getUserId } from "~/utilities/getUser";

// pass in PatientsInterface json
export const POST = async (request: Request) => {
  const body: PatientsInterface = await request.json();
  
  try {
    const userId = await getUserId() as "string";
    
    if (!userId) {
      return Response.json("Error");
    }

    const response = await setPatient(userId, body)

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