// app/api/db/messages/add/route.ts
import { NextResponse } from "next/server";
import { createMessage } from "~/server/db/queries";

export async function POST(request: Request) {
  const { conversationId, senderId, content } = await request.json();
  const message = await createMessage({ conversationId, senderId, content });
  return NextResponse.json(message);
}
