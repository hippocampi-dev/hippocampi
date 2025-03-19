"use client";

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
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Bot,
  User,
  UserCircle,
  Video,
  MessagesSquare,
  ReceiptText,
  Calendar1,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function PatientDashboardSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar className="w-64">
      <SidebarHeader>
        <h2 className="px-4 pt-2 text-xl font-bold">{`${session?.user.name}`}</h2>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu>
          <SidebarSeparator />
            <SidebarMenuItem>
              
                <Link href="/dashboard/patient">
                <SidebarMenuButton>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                  </SidebarMenuButton>
                </Link>
              
            </SidebarMenuItem>
            <SidebarMenuItem>
              
                <Link href="/dashboard/patient/schedule">
                <SidebarMenuButton>
                  <Calendar1 className="mr-2 h-4 w-4" />
                  Schedule
                  </SidebarMenuButton>
                </Link>
              
            </SidebarMenuItem>
          <SidebarMenuItem>
            
              <Link href="/dashboard/patient/messages">
              <SidebarMenuButton>
                <MessagesSquare className="mr-2 h-4 w-4" />
                Messages
                </SidebarMenuButton>
              </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            
              <Link href="/dashboard/patient/invoices">
              <SidebarMenuButton>
                <ReceiptText className="mr-2 h-4 w-4" />
                Invoices
                </SidebarMenuButton>
              </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/patient/chatbot">
                <Bot className="mr-2 h-4 w-4" />
                <span>Chat Bot</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>My Profile</span>
              <ChevronDown className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-left w-56">
            <SidebarMenu className="mb-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/patient/my-information">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Information</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                  onClick={async () => {
                    await signOut({ redirect: true, redirectTo: "/" });
                    redirect("/");
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}