import { cancelAppointment } from "~/server/db/queries";
import { AppointmentsIdInterface } from "~/server/db/type";

// pass in AppointmentsIdInterface json
export const POST = async (request: Request) => {
  const body: AppointmentsIdInterface = await request.json();

  try {
    const response = await cancelAppointment(body);

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