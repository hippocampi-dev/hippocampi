import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { hasUserRole } from "~/server/db/queries";

export default async function CheckMFA() {
  const session = await auth();
  
  if (session?.user.mfaVerified) { // user verified --> redirect to mfa
    redirect("/auth/mfa");
  }
  else { // user not verified --> redirect to setup mfa
    redirect("/auth/setup-mfa");
  }
}