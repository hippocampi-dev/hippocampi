// app/api/db/messages/conversations/add/route.ts
import { NextResponse } from "next/server";
import { getConversation, createConversation } from "~/server/db/queries";

export async function POST(request: Request) {
  const { patientId, doctorId, subject } = await request.json();

  // Check if conversation already exists
  let conversation = await getConversation(patientId, doctorId);
  if (!conversation) {
    conversation = (await createConversation({ patientId, doctorId, subject }))[0] ?? null;
  }
  return NextResponse.json(conversation);
}
