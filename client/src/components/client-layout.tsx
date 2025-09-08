"use client";

import React, { useMemo } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/header";
import KnowledgeBaseSidebar from "./sidemenu";
import { usePathname, useSearchParams } from "next/navigation";
import LetsConnectRegistrationSheet from "./connect-registeration";
import { useAuth } from "@/app/contexts/auth-context";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hideLayout = pathname === "/login";
  const { isAuthenticated } = useAuth();

  const companyId = useMemo(() => {
    const fromQuery = searchParams?.get("companyId");
    if (fromQuery && /^[0-9a-fA-F]{24}$/.test(fromQuery)) return fromQuery;

    if (!pathname) return undefined;
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (last && /^[0-9a-fA-F]{24}$/.test(last)) return last;

    return undefined;
  }, [pathname, searchParams]);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <KnowledgeBaseSidebar />
      <SidebarInset>
        <Header />
        <main className="container mx-auto min-h-screen pt-20">{children}</main>

        {!isAuthenticated && (
          <div className="fixed bottom-6 right-6 z-50 ">
            <LetsConnectRegistrationSheet companyId={companyId} />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
