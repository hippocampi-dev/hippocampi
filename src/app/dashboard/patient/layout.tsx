"use client"

// app/dashboard/layout.tsx
import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { Bell, Calendar, ChevronDown, FileText, Home, LogOut, User, UserCircle, Video } from 'lucide-react';
import Link from 'next/link';
import SignOut from '~/app/sign-out/page';
import { useSession } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For a server component you might fetch session differently.
  // For demonstration, we'll assume the session is available client-side.
  const {data: session} = useSession();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <Sidebar className="w-64">
          <SidebarHeader>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
                <Link href = "/dashboard/patient">
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
                <SidebarMenuButton>
                  <Calendar className="mr-2 h-4 w-4" />
                  Assessments
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                <SignOut>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </SignOut>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex flex-1 flex-col overflow-hidden bg-background p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
