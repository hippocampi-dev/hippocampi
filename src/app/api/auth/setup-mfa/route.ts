import { NextResponse } from "next/server"
import { auth } from "~/server/auth"
import { generateTOTPSecret, generateQRCode } from "~/lib/mfa"
import { db } from "~/server/db"
import { users } from "~/server/db/schema/auth"
import { eq } from "drizzle-orm"
import { getUser } from "~/server/db/queries"

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { secret, otpauth } = generateTOTPSecret(session.user.email!);
    const qrCode = await generateQRCode(otpauth);

    const user = await getUser(session.user.id as "string");
    const modifiedUser = {
      ...user,
      mfaTempSecret: secret
    };

    // Store the secret temporarily
    await db.update(users).set(modifiedUser).where(eq(users.id, session.user.id));

    return NextResponse.json({ qrCode, secret });
  } catch (error) {
    console.error("Error setting up MFA:", error)
    return NextResponse.json({ error: "Failed to set up MFA" }, { status: 500 })
  }
}