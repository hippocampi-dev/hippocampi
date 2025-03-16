import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { getDoctor, getUserRole, hasUserRole } from "~/server/db/queries";

export default async function Middle() {
  const session = await auth();
  const hasRole = await hasUserRole(session?.user.id as "string");
  const role = await getUserRole(session?.user.id as "string");

  if (hasRole) {
    if (role?.userRole === 'doctor') {
      const doctor = await getDoctor(session?.user.id as "string");

      if (!doctor) {
        redirect('/onboarding/start');
      }

      if (doctor?.onboardingStatus === 'not-started') {
        redirect('/onboarding/start');
      }
      else if (doctor?.onboardingStatus === 'profile') {
        redirect('/onboarding/profile-information');
      }
      else if (doctor?.onboardingStatus === 'credentials') {
        redirect('/onboarding/credentials');
      }
      else if (doctor?.onboardingStatus === 'pending-approval') {
        redirect('/onboarding/completed');
      }
      redirect('/dashboard/doctor') // credentials approved
    }
    redirect('/dashboard');
  }
  redirect('/select-role');
}
