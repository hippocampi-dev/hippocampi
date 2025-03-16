import { deleteDoctorAvailability } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { availabilityId } = body;
    
    if (!availabilityId) {
      return NextResponse.json(
        { error: "Availability ID is required" },
        { status: 400 }
      );
    }
    
    const currentUserId = await getUserId();
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }
    
    const result = await deleteDoctorAvailability(availabilityId, currentUserId);
    
    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Failed to delete availability or no availability with this ID was found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Availability deleted successfully" });
  } catch (error) {
    console.error("Error deleting availability:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
