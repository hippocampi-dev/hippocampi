import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { hasUserRole } from "~/server/db/queries";

export default async function Middle() {
  const session = await auth();
  const hasRole = await hasUserRole(session?.user.id as "string");

  if (hasRole) {
    redirect('/dashboard');
  }
  redirect('/select-role');
}
