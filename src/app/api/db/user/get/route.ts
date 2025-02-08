import { NextResponse } from "next/server";
import { auth } from "~/server/auth"

export const GET = async () => {
  try {
    // Get the session context
    const session = await auth()
    
    // Access user ID from session
    const userId = session?.user?.id;

    return NextResponse.json({ userId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}