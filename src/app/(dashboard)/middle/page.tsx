import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { getDoctor, getUserRole, hasUserRole } from "~/server/db/queries";

export default async function Middle() {
  const session = await auth();
  
  // user not logged in --> redirect to login
  if (!session?.user?.id) {
    return redirect('/auth/login');
  }

  // user didn't do mfa --> redirect to mfa
  if (!session.sessionVerified) {
    return redirect('/auth/check-mfa')
  }

  const hasRole = await hasUserRole(session.user.id as "string");
  const role = await getUserRole(session.user.id as "string");

  // doctors
  if (hasRole && role?.userRole === 'doctor') {
    const doctor = await getDoctor(session.user.id as "string");
    
    if (!doctor || doctor.onboardingStatus === 'not-started') {
      return redirect('/onboarding/start');
    }
    
    // direct to appropriate onboarding page
    switch (doctor.onboardingStatus) {
      case 'profile':
        return redirect('/onboarding/profile-information');
      case 'credentials':
        return redirect('/onboarding/credentials');
      case 'pending':
        return redirect('/onboarding/complete');
      default:
        return redirect('/dashboard/doctor');
    }
  }
  
  // no issues --> direct to dashboard
  return redirect('/dashboard');
}