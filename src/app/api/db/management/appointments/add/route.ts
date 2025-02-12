import { addAppointment } from "~/server/db/queries";
import { AppointmentsInterface } from "~/server/db/type";

// pass in AppointmentsInterface json
export const POST = async (request: Request) => {
  const body: AppointmentsInterface = await request.json();

  try {
    const response = await addAppointment(body);

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