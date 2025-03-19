import { NextResponse } from "next/server";
import { getDoctor } from "~/server/db/queries";

export const GET = async (request: Request) => {
  try {
    // Get the doctor id from the URL query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") as "string";
    
    if (!id) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }
    
    const doctor = await getDoctor(id);
    
    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ doctor });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
