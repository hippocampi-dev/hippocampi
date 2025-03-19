import { NextResponse } from "next/server";
import { updateAppointmentStatus } from "~/server/db/queries";
import { AppointmentsIdInterface } from "~/server/db/type";

// pass in AppointmentsIdInterface json
export const POST = async (request: Request) => {
  try {
    const { id } = await request.json();
    console.log("Canceling appointment with ID:", id);
    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }
    console.log("Updated appointment:");
    const updatedAppointment = await updateAppointmentStatus(id, "Canceled");
    if (!updatedAppointment) {
      return NextResponse.json(
        { error: "Failed to cancel appointment" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      appointment: updatedAppointment 
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};