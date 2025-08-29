"use client";

import { useEffect, useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import Header from "@/components/header";
import Link from "next/link";
import { useAuth } from "@/app/contexts/auth-context";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        variant="sidebar"
        collapsible="offcanvas"
      >
        <SidebarHeader>
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-medium">Knowledge Base</span>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/knowledgebase">Knowledge Base</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user?.role === "SUPER_ADMIN" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/companies">Companies</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="container mx-auto min-h-screen pt-20">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
