import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getAppointment, getDoctor } from "~/server/db/queries";
import { GenerateToken } from "../generate-token/route";

export async function POST(request: Request) {
  const { patientId, appointmentId } = await request.json();

  const appointment = await getAppointment(appointmentId);
  const doctor = await getDoctor(appointment?.doctorId as "string");

  const zoomMeetingOptions = {
    "topic": appointment?.reason,
    "type": 1, // Instant meeting
    "alternative_hosts": `${doctor?.email}`,
    "settings": {
      "host_video": true,
      "participant_video": true,
      "join_before_host": false,
      "mute_upon_entry": false,
      "watermark": false,
      "use_pmi": false,
      "approval_type": 0,
      "audio": "both",
    }
  }

  try {
    const tokenReponse = await GenerateToken();

    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenReponse?.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zoomMeetingOptions),
    });

    // console.log(response);
    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ join_url: data.join_url, id: data.id })
    } else {
      console.error("Zoom API error:", data)
      return NextResponse.json({ error: "Failed to create Zoom meeting", details: data }, { status: response.status })
    }
  } catch (error) {
    console.error("Error creating Zoom meeting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}