import { NextResponse } from "next/server";
import { isDoctorSubscribed } from "~/server/db/queries";
import { getUserId } from "~/utilities/get-user";

export const GET = async () => {
  try {
    const userId = await getUserId() as "string";;

    if (userId) {
      const response = await isDoctorSubscribed(userId);

      return NextResponse.json({ response })
    }

    return undefined;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
};