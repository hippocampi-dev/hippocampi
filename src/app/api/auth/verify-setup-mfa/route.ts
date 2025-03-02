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

  try {
    const { code, secret } = await request.json();

    if (!code || !secret) {
      return NextResponse.json({ error: "Code and secret are required" }, { status: 400 })
    }

    // Verify the token
    const isValid = verifyTOTP(code, secret);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    const user = await getUser(session.user.id as "string");
    const modifiedUser = {
      ...user,
      mfaEnabled: true,
      mfaVerified: true,
      mfaSecret: secret,
      mfaTempSecret: null
    };

    // If valid, update the user's MFA status
    await db
      .update(users)
      .set(modifiedUser)
      .where(eq(users.id, session.user.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying MFA setup:", error)
    return NextResponse.json({ error: "Failed to verify MFA" }, { status: 500 })
  }
}