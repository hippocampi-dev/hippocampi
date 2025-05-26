'use client'

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { PatientDashboardSidebar, SidebarContext, useSidebar } from "~/components/patient-dashboard/PatientSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { UserRolesInterface } from "~/server/db/type";

// In layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true);
  
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  
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
        {/* Pass state and toggle function to sidebar */}
        <PatientDashboardSidebar 
          isExpanded={sidebarExpanded} 
          onToggle={toggleSidebar} 
        />
        
        {/* Adjust main content based on sidebar state */}
        <main 
          className="px-4 flex-1 overflow-auto transition-all duration-300 ease-in-out"
          style={{ 
            marginLeft: sidebarExpanded ? '0' : '-240px', // Adjust based on collapsed width
          }}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
