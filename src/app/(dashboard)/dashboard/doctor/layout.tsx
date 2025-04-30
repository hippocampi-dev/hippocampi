"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDoctorSubscriptionDetails } from "~/app/_actions/users/actions";
import { DoctorDashboardSidebar } from "~/components/doctor-dashboard/DoctorSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { DoctorsInterface, UserRolesInterface } from "~/server/db/type";


export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const protect = async () => {
      const role: UserRolesInterface = await fetch('/api/db/management/user-role/get').then(r => r.json()).then(r => r.response);
  
      if (role.userRole === 'patient') { // no patient
        router.push('/middle');
      }
      const doctor: DoctorsInterface | undefined = await fetch('/api/db/doctor/get').then(r => r.json()).then(r => r.response);
  
      if (!doctor || doctor.onboardingStatus !== 'approved') { // not approved
        router.push('/middle');
      }
      
      const doctorSubscription = await getDoctorSubscriptionDetails(doctor?.doctorId!);
      if (doctorSubscription?.status === 'unsubscribed') { // if no subscription
        if (doctorSubscription.stripeCustomerId) { // if canceled subscription
          router.push('/checkout/billing');
        }
        else { // if new customer
          router.push('/checkout/subscription');
        }
      }
    }

    protect();
  }, [])
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <DoctorDashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}