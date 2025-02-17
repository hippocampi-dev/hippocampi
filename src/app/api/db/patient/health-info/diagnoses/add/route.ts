import { addDiagnoses } from "~/server/db/queries";
import { PatientDiagnosesInterface } from "~/server/db/type";

// pass in PatientDiagnosesInteface json
export const POST = async (request: Request) => {
  const body: PatientDiagnosesInterface = await request.json();
  
  try {
    const response = await addDiagnoses(body);

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