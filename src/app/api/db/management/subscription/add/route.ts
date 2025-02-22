import { addDoctorSubscription } from "~/server/db/queries";
import { SubscriptionsInterface } from "~/server/db/type";

// pass in DoctorsInteface json
export const POST = async (request: Request) => {
  const body: SubscriptionsInterface = await request.json();
  
  try {
    const response = await addDoctorSubscription(body);

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