// app/api/db/messages/get/route.ts
import { db } from "~/server/db";
import * as schema from "~/server/db/schema/message";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getMessages } from "~/server/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json({ error: "No conversationId provided" }, { status: 400 });
  }
  const conversationSubjects = await db.query.conversations.findFirst({
      where: eq(schema.conversations.conversationId, conversationId),
      columns: {
        subject: true,
      }
    });
    console.log(conversationSubjects);
  return NextResponse.json(conversationSubjects);
}
