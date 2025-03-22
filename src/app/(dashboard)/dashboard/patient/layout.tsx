'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PatientDashboardSidebar } from "~/components/patient-dashboard/PatientSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { UserRolesInterface } from "~/server/db/type";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const protect = async () => {
      const role: UserRolesInterface = await fetch('/api/db/management/user-role/get').then(r => r.json()).then(r => r.response);
  
      if (role.userRole === 'doctor') {
        router.push('/middle');
      }
    }

    protect();
  }, [])

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <PatientDashboardSidebar />
        <main className="flex flex-1 flex-col bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
