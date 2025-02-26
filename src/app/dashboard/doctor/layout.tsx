import { DoctorDashboardSidebar } from "~/components/doctor-dashboard/DoctorSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

export default function DoctorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <DoctorDashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </SidebarProvider>
  )
}