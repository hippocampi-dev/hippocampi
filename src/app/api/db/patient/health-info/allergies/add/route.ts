import { addAllergies } from "~/server/db/queries";
import { PatientAllergiesInterface } from "~/server/db/type";

// pass in PatientAllergiesInteface json
export const POST = async (request: Request) => {
  try {
  const rawBody = await request.json();
        console.log("Raw cogniSymps data:", rawBody);
        const patientId = rawBody.patientId;
        // Iterate through each medication and convert date strings.
        const body: PatientAllergiesInterface = rawBody.allergies.map((aller: any) => {
          const {...rest} = aller;
          return {
            patientId,
            ...aller,
          }
        });
        console.log(body)
    const response = await addAllergies(body);
    if (!response) {
      return new Response(JSON.stringify("Error"), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
};