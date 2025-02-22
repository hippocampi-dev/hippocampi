// app/api/db/messages/conversations/get/route.ts
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema/message";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const res = await request.json();
  console.log(res);
  const conversations = await db.query.conversations.findMany({});
  return NextResponse.json(conversations);
  // const conversations = await db.query.conversations.findMany({
  //   where: eq(schema.conversations.patientId, res.patientId),
  //   orderBy: schema.conversations.updated_at,
  // });
  // return NextResponse.json(conversations);
}
