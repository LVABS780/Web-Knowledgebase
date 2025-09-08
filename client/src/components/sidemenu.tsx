// KnowledgeBaseSidebar.tsx
"use client";

import { Home, Notebook, Building, ChevronRight, Dot } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
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
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/auth-context";
import { Avatar } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useResourceById, useResourcesQuery } from "@/hooks/useResources";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseItems: React.SetStateAction<any[]> = [];

const authenticatedItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Knowledge Base",
    url: "/companies/knowledgebase",
    icon: Notebook,
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
  const searchParams = useSearchParams();
  const { setOpenMobile } = useSidebar();

  const [menuItems, setMenuItems] = useState(baseItems);
  const [expandedResourceId, setExpandedResourceId] = useState<
    string | undefined
  >(undefined);
  const { data: resources } = useResourcesQuery();

  const selectedResourceId = useMemo(
    () => searchParams.get("r") || undefined,
    [searchParams]
  );
  const { data: selectedResource } = useResourceById(
    selectedResourceId,
    !!selectedResourceId
  );

  useEffect(() => {
    setExpandedResourceId(selectedResourceId || undefined);
  }, [selectedResourceId]);

  useEffect(() => {
    if (role === "SUPER_ADMIN") {
      setMenuItems(adminItems);
    } else if (user) {
      setMenuItems([...authenticatedItems]);
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
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronRight className="ml-auto opacity-60" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {pathname === "/" && (
          <SidebarGroup>
            <SidebarMenu>
              {(resources || []).map((r) => {
                const href = `${pathname}?r=${r._id}`;
                const isActive = selectedResourceId === r._id;
                const isExpanded = expandedResourceId === r._id;
                return (
                  <React.Fragment key={r._id}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={
                          isActive
                            ? "bg-[#6A00B4] text-white hover:bg-[#7f04d4] hover:text-white"
                            : ""
                        }
                        onClick={() => setOpenMobile(false)}
                      >
                        <Link
                          href={href}
                          onClick={() =>
                            setExpandedResourceId((prev) =>
                              prev === r._id ? undefined : r._id
                            )
                          }
                        >
                          <span className="flex-1 text-left">{r.title}</span>
                          <ChevronRight
                            className={`ml-auto opacity-60 transition-transform ${
                              isExpanded ? "rotate-90" : "rotate-0"
                            }`}
                          />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {isExpanded &&
                      selectedResource &&
                      selectedResource._id === r._id &&
                      (selectedResource.sections || []).length > 0 && (
                        <div className="ml-6">
                          <SidebarMenu>
                            {selectedResource.sections?.map((s, idx) => (
                              <SidebarMenuItem key={`section-${idx}`}>
                                <SidebarMenuButton
                                  asChild
                                  onClick={() => setOpenMobile(false)}
                                >
                                  <Link
                                    href={`/?r=${selectedResource._id}#s-${idx}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const href = `/?r=${selectedResource._id}#s-${idx}`;
                                      window.history.replaceState(
                                        null,
                                        "",
                                        href
                                      );
                                      window.dispatchEvent(
                                        new CustomEvent("kb-scroll-to", {
                                          detail: `s-${idx}`,
                                        })
                                      );
                                      setOpenMobile(false);
                                    }}
                                  >
                                    <Dot />
                                    <span className="flex-1 text-left text-sm">
                                      {s.subtitle || `Section ${idx + 1}`}
                                    </span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </div>
                      )}
                  </React.Fragment>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="shadow-md bg-white dark:bg-black" />
    </Sidebar>
  );
};

export default KnowledgeBaseSidebar;
