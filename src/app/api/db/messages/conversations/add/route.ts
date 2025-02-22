// app/api/db/messages/conversations/add/route.ts
import { NextResponse } from "next/server";
import { s } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
import { db } from "~/server/db";
import { createConversation } from "~/server/db/queries";
import { ConversationsInterface } from "~/server/db/type";

export async function POST(request: Request) {
  const { patientId, doctorId, subject } = await request.json();
  const response = await createConversation({ patientId, doctorId, subject });
  console.log(response);
  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
