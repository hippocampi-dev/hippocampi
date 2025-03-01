import { NextResponse } from "next/server";
import { getAllergies } from "~/server/db/queries";
import { getUserId } from "~/utilities/getUser";

export const GET = async () => {
  try {
    const userId = await getUserId() as "string";;

    if (userId) {
      const response = await getAllergies(userId);

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