import { NextResponse } from "next/server";
import { getAllDoctors } from "~/server/db/queries";

export const GET = async () => {
  try {
    const response = await getAllDoctors();
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
};
