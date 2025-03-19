import { NextResponse } from "next/server";
import { updateAppointmentStatus } from "~/server/db/queries";

export const POST = async (request: Request) => {
  try {
    const { id, status } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    if (!status || !["Scheduled", "Completed", "Canceled", "No-Show"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required (Scheduled, Completed, Canceled, or No-Show)" },
        { status: 400 }
      );
    }
    
    const updatedAppointment = await updateAppointmentStatus(id, status );
    
    if (!updatedAppointment || updatedAppointment.length === 0) {
      return NextResponse.json(
        { error: "Failed to update appointment status" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      appointment: updatedAppointment[0]
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};