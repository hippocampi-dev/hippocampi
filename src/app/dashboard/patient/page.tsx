
import * as React from 'react'
import { Bell, Calendar, ChevronDown, FileText, Home, LogOut, User, UserCircle, Video } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
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
} from '~/components/ui/sidebar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import TitleCard from '~/components/patient-dashboard/TitleCard'
import PatientNotifications from '~/components/patient-dashboard/PatientNotifications'
import HealthcareProviders from '~/components/patient-dashboard/HealthcareProviders'
import { auth } from '~/server/auth'
import SignOut from '~/app/sign-out/page'

export default async function PatientDashboard() {
  const session = await auth();
  if (!session) {
    redirect("/sign-in")
  }
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="w-64">
          <SidebarHeader>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Information</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <SignOut/>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex flex-1 flex-col overflow-hidden bg-background p-8">
          <TitleCard name = {session.user.name}/>
          <div className="grid flex-1 gap-8 overflow-hidden md:grid-cols-3">
            <PatientNotifications></PatientNotifications>
            <div className="flex flex-col space-y-8">
              <HealthcareProviders></HealthcareProviders>
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Video className="mr-2 h-4 w-4" />
                    Join Video Call
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}