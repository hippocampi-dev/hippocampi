import { NextResponse } from "next/server";
import { getPatient } from "~/server/db/queries";
import { UserIdInterface } from "~/server/db/type";
import { getUserId } from "~/utilities/getUser";

export const GET = async () => {
  try {
    const userId = await getUserId() as "string";;

    if (userId) {
      const response = await getPatient(userId);

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

export const POST = async (request: Request) => {
  const body: UserIdInterface = await request.json();

  try {
    if (body) {
      const response = await getPatient(body);

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