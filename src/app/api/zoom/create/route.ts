import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const ZOOM_API_KEY = process.env.ZOOM_API_KEY
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET

export async function POST(request: Request) {
  const { topic } = await request.json()

  const payload = {
    iss: ZOOM_API_KEY,
    exp: new Date().getTime() + 5000,
  }

  const token = jwt.sign(payload, ZOOM_API_SECRET!)

  const zoomMeetingOptions = {
    topic: topic,
    type: 1, // Instant meeting
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: false,
      watermark: false,
      use_pmi: false,
      approval_type: 0,
      audio: "both",
      auto_recording: "none",
    },
  }

  try {
    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(zoomMeetingOptions),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({ join_url: data.join_url, id: data.id })
    } else {
      return NextResponse.json({ error: "Failed to create Zoom meeting" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating Zoom meeting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}