import { addDoctorCredentials } from "~/server/db/queries";
import { DoctorCredentialsInterface } from "~/server/db/type";

// pass in DoctorCredentialsInteface json
export const POST = async (request: Request) => {
  const body: DoctorCredentialsInterface = await request.json();
  
  try {
    const response = await addDoctorCredentials(body);

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