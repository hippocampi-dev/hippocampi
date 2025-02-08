import { addDoctor } from "~/server/db/queries";
import { DoctorsInterface } from "~/server/db/type";

// pass in DoctorsInteface json
export const POST = async (request: Request) => {
  const body: DoctorsInterface = await request.json();
  
  try {
    const response = await addDoctor(body);

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