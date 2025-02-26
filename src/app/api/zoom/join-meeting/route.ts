import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const ZOOM_API_KEY = process.env.ZOOM_API_KEY
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET

export async function POST(request: Request) {
  const { meetingId } = await request.json()

  const payload = {
    iss: ZOOM_API_KEY,
    exp: new Date().getTime() + 5000,
  }

  const token = jwt.sign(payload, ZOOM_API_SECRET!)

  try {
    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({ join_url: data.join_url })
    } else {
      return NextResponse.json({ error: "Failed to retrieve Zoom meeting" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error retrieving Zoom meeting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}