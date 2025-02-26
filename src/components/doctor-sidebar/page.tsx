"use client";

import {
  Home,
  Calendar,
  Users,
  Settings,
  LogOut,
  User,
  Receipt,
  ReceiptText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function DoctorDashboardSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-4 py-2 text-xl font-bold">{`Dr ${session?.user.name}`}</h2>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/">
                <Home className="mr-2 h-4 w-4" />
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
                <Users className="mr-2 h-4 w-4" />
                <span>Patients</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Appointments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/billing">
                <Receipt className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/invoices">
                <ReceiptText className="mr-2 h-4 w-4" />
                <span>Invoices</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/doctor/account">
                <User className="mr-2 h-4 w-4" />
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
      <SidebarContent className="mb-10 mt-auto flex flex-col justify-end px-4">
        <SidebarMenu>
          <button
            className={`w-full text-left`}
            onClick={async () => {
              await signOut({ redirect: true, redirectTo: "/" });
              redirect("/");
            }}
          >
            <SidebarMenuItem className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuItem>
          </button>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
