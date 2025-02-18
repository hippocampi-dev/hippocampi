import { addInvoice } from "~/server/db/queries";

// pass in PatientDoctorManagementInterface json
export const POST = async (request: Request) => {
  const body = await request.json();
  
  try {
    const response = await addInvoice(body);

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