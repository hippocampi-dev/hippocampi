// app/api/db/messages/add/route.ts
import { NextResponse } from "next/server";
import { createMessage } from "~/server/db/queries";
import { MessagesInterface } from "~/server/db/type";

export async function POST(request: Request) {
  const { conversationId, senderId, content } = await request.json();

  const newMessage: MessagesInterface = {
    conversationId: conversationId,
    senderId: senderId,
    content: content,
    time: new Date()
  }
  const message = await createMessage(newMessage);
  return NextResponse.json(message);
}
