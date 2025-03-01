import { NextResponse } from "next/server"
import { GenerateToken } from "../../../../utilities/generateZoomToken"

export async function POST(request: Request) {
  const { meetingId } = await request.json()

  try {
    const tokenReponse = await GenerateToken();

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenReponse}`,
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