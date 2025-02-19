import { convertDateStringToDate } from "~/lib/utils";
import { addDiagnoses } from "~/server/db/queries";
import { PatientDiagnosesInterface } from "~/server/db/type";

// pass in PatientDiagnosesInteface json
export const POST = async (request: Request) => {
  const rawBody = await request.json();
    console.log(rawBody)
    // Convert the dateOfBirth string to a Date object
    const diagnosisDate = convertDateStringToDate(rawBody.diagnosis.diagnosisDate);
  
    const body: PatientDiagnosesInterface = {
      ...rawBody,
      diagnosisDate, // now a Date object
    };
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