import { Home, Calendar, Users, Settings, LogOut, User, Receipt, ReceiptText } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useContext } from "react"
import { DoctorDashboardContext } from "~/app/context/DoctorDashboardContext"
export function DoctorDashboardSidebar() {
  const context = useContext(DoctorDashboardContext);
  const handleSignOut = () => {
    signOut({
      redirect: true,
      redirectTo: '/'
    });
  }

  if (!context || context.isLoading || !context.data) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold px-4 py-2">{context ? `Dr ${context.doctor?.lastName}`: ''}</h2>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/">
                <Home className="w-4 h-4 mr-2" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/appointments">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Appointments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/patients">
                <Users className="w-4 h-4 mr-2" />
                <span>Patients</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/billing">
                <Receipt className="w-4 h-4 mr-2" />
                <span>Billing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/invoices">
                <ReceiptText className="w-4 h-4 mr-2" />
                <span>Invoices</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/account">
                <User className="w-4 h-4 mr-2" />
                <span>Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/settings">
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarContent>
      <SidebarContent className="mt-auto flex flex-col justify-end mb-10 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}