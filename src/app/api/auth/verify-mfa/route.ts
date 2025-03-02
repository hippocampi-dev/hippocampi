import { NextResponse } from "next/server"
import { auth } from "~/server/auth"
import { verifyTOTP } from "~/lib/mfa"
import { db } from "~/server/db"
import { users } from "~/server/db/schema/auth"
import { eq } from "drizzle-orm"
import { getUser } from "~/server/db/queries"

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { code } = await request.json();

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      mfaSecret: true,
      mfaEnabled: true,
    },
  });

  if (!user?.mfaSecret || !user.mfaEnabled) {
    return NextResponse.json({ error: "MFA is not set up for this user" }, { status: 400 })
  }

  // Verify the token
  const isValid = verifyTOTP(code, user.mfaSecret);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}