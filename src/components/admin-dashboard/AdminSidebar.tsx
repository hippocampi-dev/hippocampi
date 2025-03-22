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
  MessagesSquare,
  Receipt,
  ReceiptText,
  User,
  UserCircle,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function AdminDashboardSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar className="w-64">
      <SidebarHeader>
        <h2 className="px-4 py-2 text-xl font-bold">{`${session?.user.name} (Admin)`}</h2>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu>
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/admin/">
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
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
      </SidebarContent>
    </Sidebar>
  );
}