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
  PanelRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { cn } from "~/lib/utils";



export const SidebarContext = React.createContext({ 
  isExpanded: true, 
  toggleSidebar: () => {} 
});

export function PatientDashboardSidebar({ 
  isExpanded, 
  onToggle 
}: { 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { data: session } = useSession();
  
  return (
    <Sidebar className={cn('border-r transition-all duration-300 ease-in-out', 
                        isExpanded ? 'w-64' : 'w-0', 
                        'flex h-full')}>
      <SidebarHeader>
        <div className="flex justify-between items-center">
          <h2 className={cn(isExpanded ? '' : 'hidden', "px-4 pt-2 text-xl font-bold")}>
            {`${session?.user?.name}`}
          </h2>
          <button onClick={onToggle} className="px-4 pt-2">
            {isExpanded ? 
              <PanelLeftClose className="h-6 w-6 transition-transform duration-300" /> : 
              <PanelLeftOpen className="h-6 w-6 transition-transform duration-300" />
            }
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent className = "">
        <SidebarMenu>
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/patient">
                <Home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/patient/schedule">
                <Calendar1 className="mr-2 h-4 w-4" />
                <span>Schedule</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/patient/messages">
                <MessagesSquare className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/patient/invoices">
                <ReceiptText className="mr-2 h-4 w-4" />
                <span>Invoices</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/patient/chatbot">
                <Bot className="mr-2 h-4 w-4" />
                <span>Chat Bot</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/patient/ckc">
                <Bot className="mr-2 h-4 w-4" />
                <span>Curated Knowledge Center</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className= "px-4">
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

export const useSidebar = () => React.useContext(SidebarContext);