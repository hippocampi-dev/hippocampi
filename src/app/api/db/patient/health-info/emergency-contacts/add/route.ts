import { addEmergencyContacts } from "~/server/db/queries";
import { PatientEmergencyContactsInterface } from "~/server/db/type";

// pass in PatientEmergencyContactsInteface json
export const POST = async (request: Request) => {
  const body: PatientEmergencyContactsInterface = await request.json();
  
  try {
    const response = await addEmergencyContacts(body);

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