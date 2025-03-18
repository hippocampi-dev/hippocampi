"use client";

import { DoctorDashboardSidebar } from "~/components/doctor-dashboard/DoctorSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";


export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();

  // useEffect(() => {
  //   const fetchDoctor = async () => {
  //     const doctor: DoctorsInterface | undefined = await fetch('/api/db/doctor/get').then(r => r.json()).then(r => r.response);
  
  //     if (!doctor || doctor.onboardingStatus !== 'approved') {
  //       router.push('/middle');
  //     }
  //   }

  //   fetchDoctor();
  // }, [])
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