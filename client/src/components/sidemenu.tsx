"use client";

import { Home, Notebook, Building } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/auth-context";
import { Avatar } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

const baseItems = [
  {
    title: "Knowledge Base",
    url: "/",
    icon: Notebook,
  },
];

const authenticatedItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
];

const adminItems = [
  {
    title: "Companies",
    url: "/companies",
    icon: Building,
    role: "SUPER_ADMIN",
  },
];

const KnowledgeBaseSidebar = () => {
  const { user } = useAuth();
  const role = user?.role;
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const [menuItems, setMenuItems] = useState(baseItems);

  useEffect(() => {
    if (role === "SUPER_ADMIN") {
      setMenuItems(adminItems);
    } else if (user) {
      setMenuItems([...authenticatedItems, ...baseItems]);
    } else {
      setMenuItems(baseItems);
    }
  }, [role, user]);

  return (
    <Sidebar collapsible="icon">
      {user && (
        <SidebarHeader className="pt-3.5 border-r shadow-md bg-white dark:bg-black">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="border border-black/30 size-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-800 to-blue-600 text-white font-extrabold text-2xl">
                    {user?.name!.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}

      <SidebarContent className="border-r shadow-md pt-6 bg-white dark:bg-black">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`${
                    pathname === item.url
                      ? "bg-[#6A00B4] text-white hover:bg-[#7f04d4] hover:text-white"
                      : ""
                  }`}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href={item.url}>
                    <item.icon className="text-indigo-950 dark:text-white" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="shadow-md bg-white dark:bg-black" />
    </Sidebar>
  );
};

export default KnowledgeBaseSidebar;
