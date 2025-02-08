import { addScheduledMeeting } from "~/server/db/queries";
import { ScheduledMeetingsInterface } from "~/server/db/type";

// pass in ScheduledMeetingsInterface json
export const POST = async (request: Request) => {
  const body: ScheduledMeetingsInterface = await request.json();

  try {
    const response = await addScheduledMeeting(body);

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