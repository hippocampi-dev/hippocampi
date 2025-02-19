import { convertDateStringToDate } from "~/lib/utils";
import { addPatient } from "~/server/db/queries";
import { PatientsInterface } from "~/server/db/type";



// pass in PatientsInteface json
export const POST = async (request: Request) => {
  const rawBody = await request.json();
  
  // Convert the dateOfBirth string to a Date object
  const dateOfBirth = convertDateStringToDate(rawBody.dateOfBirth);

  const body: PatientsInterface = {
    ...rawBody,
    dateOfBirth, // now a Date object
  };

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
