import { setDoctorSubscription } from "~/server/db/queries";
import { DoctorSubscriptionsInterface } from "~/server/db/type";
import { getUserId } from "~/utilities/get-user";

// pass in DoctorSubscriptionsInterface json
export const POST = async (request: Request) => {
  const body: DoctorSubscriptionsInterface = await request.json();
  
  try {
    const userId = await getUserId() as "string";
    
    if (!userId) {
      return Response.json("Error");
    }

    const response = await setDoctorSubscription(userId, body)

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