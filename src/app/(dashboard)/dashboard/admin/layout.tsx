'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminDashboardSidebar } from "~/components/admin-dashboard/AdminSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { UserRolesInterface } from "~/server/db/type";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const protect = async () => {
      const role: UserRolesInterface = await fetch('/api/db/management/user-role/get').then(r => r.json()).then(r => r.response);
  
      if (role.userRole !== 'admin') {
        router.push('/middle');
      }
    }

    protect();
  }, [])

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AdminDashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}