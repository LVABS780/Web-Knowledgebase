"use client";

import { Home, Notebook, Building, ChevronRight, Dot } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Sidebar,
  SidebarContent,
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
import {
  useResourceById,
  useResourcesQuery,
  useResourcesByCompany,
} from "@/hooks/useResources";

const baseItems: React.SetStateAction<any[]> = [];

const authenticatedItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Knowledge Base", url: "/companies/knowledgebase", icon: Notebook },
];

const adminItems = [
  {
    title: "Companies",
    url: "/companies",
    icon: Building,
    role: "SUPER_ADMIN",
  },
];

const isObjectId = (id?: string | null) =>
  Boolean(id) && /^[0-9a-fA-F]{24}$/.test(id!);

const KnowledgeBaseSidebar = () => {
  const { user } = useAuth();
  const role = user?.role;
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const { setOpenMobile } = useSidebar();

  const [menuItems, setMenuItems] = useState(baseItems);
  const [expandedResourceId, setExpandedResourceId] = useState<
    string | undefined
  >();

  const pathParts = pathname.split("/").filter(Boolean);

  let companyId: string | undefined;
  let resourceIdFromPath: string | undefined;

  if (pathParts[0] === "companies" && pathParts[1] === "knowledgebase") {
    companyId = user?.companyId;
    resourceIdFromPath = undefined;
  } else {
    if (isObjectId(pathParts[0])) companyId = pathParts[0];
    if (isObjectId(pathParts[1])) resourceIdFromPath = pathParts[1];
  }

  const { data: globalResources } = useResourcesQuery();
  const { data: companyResources } = useResourcesByCompany(
    companyId!,
    {},
    !!companyId
  );

  const resources = companyId ? companyResources : globalResources;

  const selectedResourceId = useMemo(
    () => resourceIdFromPath || searchParams.get("r") || undefined,
    [resourceIdFromPath, searchParams]
  );

  const { data: selectedResource } = useResourceById(
    isObjectId(selectedResourceId) ? selectedResourceId : undefined,
    !!(selectedResourceId && isObjectId(selectedResourceId))
  );

  useEffect(() => {
    setExpandedResourceId(selectedResourceId || undefined);
  }, [selectedResourceId]);

  useEffect(() => {
    if (role === "SUPER_ADMIN") setMenuItems(adminItems);
    else if (user) setMenuItems([...authenticatedItems]);
    else setMenuItems(baseItems);
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
                  className={
                    pathname === item.url
                      ? "bg-[#6A00B4] text-white hover:bg-[#7f04d4] hover:text-white"
                      : ""
                  }
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronRight className="ml-auto opacity-60" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            {!["COMPANY_ADMIN", "SUPER_ADMIN"].includes(role!) &&
              (resources || []).map((r) => {
                const href = companyId
                  ? `/${companyId}?r=${r._id}`
                  : `/?r=${r._id}`;
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
                                    href={
                                      companyId
                                        ? `/${companyId}?r=${selectedResource._id}#s-${idx}`
                                        : `/?r=${selectedResource._id}#s-${idx}`
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const href = companyId
                                        ? `/${companyId}?r=${selectedResource._id}#s-${idx}`
                                        : `/?r=${selectedResource._id}#s-${idx}`;
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
      </SidebarContent>
    </Sidebar>
  );
};

export default KnowledgeBaseSidebar;
