"use client";

// app/dashboard/layout.tsx
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  Home,
  LogOut,
  MessagesSquare,
  User,
  UserCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { PatientDashboardProvider } from "~/app/context/PatientDashboadContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For a server component you might fetch session differently.
  // For demonstration, we'll assume the session is available client-side.

  return (
    <PatientDashboardProvider>
        <SidebarProvider>
          <div className="flex h-screen w-screen">
            <Sidebar className="w-64">
              <SidebarHeader>
                <SidebarMenuButton asChild>
                  <Link href="/" className="flex w-full items-center">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Main Page
                  </Link>
                </SidebarMenuButton>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem></SidebarMenuItem>
                  <SidebarSeparator />
                  <Link href="/dashboard/patient">
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Home className="mr-2 h-4 w-4" />
                        Home
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText className="mr-2 h-4 w-4" />
                      Chart
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/dashboard/patient/messages">
                      <SidebarMenuButton>
                        <FileText className="mr-2 h-4 w-4" />
                        Messages
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Calendar className="mr-2 h-4 w-4" />
                      Assessments
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/patient/chatbot">
                        <MessagesSquare className="mr-2 h-4 w-4" />
                        Chat Bot
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/dashboard/patient/invoices">
                      <SidebarMenuButton>
                        <FileText className="mr-2 h-4 w-4" />
                        Invoices
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  {/* <SidebarMenuItem>
                    <Link href="/dashboard/patient/billing">
                      <SidebarMenuButton>
                        <FileText className="mr-2 h-4 w-4" />
                        Billing
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem> */}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <UserCircle className="mr-2 h-4 w-4" />
                      My Profile
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <Link href="/dashboard/patient/my-information">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>My Information</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <button
                      className={`w-full text-left`}
                      onClick={async () => {
                        await signOut({ redirect: true, redirectTo: "/" });
                        redirect("/");
                      }}
                    >
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarFooter>
            </Sidebar>
            <main className="flex flex-1 flex-col bg-background p-8">
              {children}
            </main>
          </div>
        </SidebarProvider>
    </PatientDashboardProvider>
    
  );
}
