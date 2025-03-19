import { addAppointment } from "~/server/db/queries";
import { AppointmentsInterface } from "~/server/db/type";

// pass in AppointmentsInterface json
export const POST = async (request: Request) => {
  const body = await request.json();
  // console.log(body);
  const scheduledAtTest = new Date(body.scheduledAt).toISOString()
  const scheduledAtComparison = new Date().toISOString()

  if (scheduledAtTest === scheduledAtComparison) {
    console.log("true");
  }
  else {
    console.log("false");
  }
  
  const apppointment: AppointmentsInterface = {
    ...body,
    scheduledAt: new Date(body.scheduledAt).toISOString(),
  };

  try {
    const response = await addAppointment(apppointment);

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