import { NextResponse } from "next/server";
import { getInvoice } from "~/server/db/queries";
import { getUserId } from "~/utilities/get-user";

export const GET = async () => {
  try {
    const userId = await getUserId() as "string";

    if (userId) {
      const response = await getInvoice(userId);
      // console.log('response', response)
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