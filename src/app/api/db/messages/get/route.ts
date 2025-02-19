// app/api/db/messages/get/route.ts
import { NextResponse } from "next/server";
import { getMessages } from "~/server/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json({ error: "No conversationId provided" }, { status: 400 });
  }
  const messages = await getMessages(conversationId);
  return NextResponse.json(messages);
}
