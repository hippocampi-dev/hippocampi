import { NextResponse } from "next/server";
import { getAppointments } from "~/server/db/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('id');
    
    if (!doctorId) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }
    
    const appointments = await getAppointments(doctorId as "string");
    
    return NextResponse.json({
      appointments,
    });
    
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor appointments" },
      { status: 500 }
    );
  }
}
