import { addAllergies } from "~/server/db/queries";
import { PatientAllergiesInterface } from "~/server/db/type";

// pass in PatientAllergiesInteface json
export const POST = async (request: Request) => {
  let body: PatientAllergiesInterface;
  try {
    body = await request.json();
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return new Response(JSON.stringify({ error: "Invalid JSON input" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  console.log(body);
  try {
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