import { cancelScheduledMeeting } from "~/server/db/queries";
import { ScheduledMeetingsIdInterface } from "~/server/db/type";

// pass in ScheduledMeetingsIdInterface json
export const POST = async (request: Request) => {
  const body: ScheduledMeetingsIdInterface = await request.json();

  try {
    const response = await cancelScheduledMeeting(body);

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