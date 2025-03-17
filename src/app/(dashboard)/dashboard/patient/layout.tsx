import { PatientDashboardSidebar } from "~/components/patient-dashboard/PatientSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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
