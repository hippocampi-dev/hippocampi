// app/api/db/messages/conversations/get/route.ts
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema/message";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");
  if (!patientId) {
    return NextResponse.json({ error: "No patientId provided" }, { status: 400 });
  }
  const conversations = await db.query.conversations.findMany({
    where: eq(schema.conversations.patientId, patientId),
    orderBy: schema.conversations.updated_at,
  });
  return NextResponse.json(conversations);
}
