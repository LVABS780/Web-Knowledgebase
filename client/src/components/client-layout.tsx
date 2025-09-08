"use client";

// import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/header";
import KnowledgeBaseSidebar from "./sidemenu";
// import { useAuth } from "@/app/contexts/auth-context";
// import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import LetsConnectRegistrationSheet from "./connect-registeration";
import { useAuth } from "@/app/contexts/auth-context";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login";
  const { isAuthenticated } = useAuth();

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
            <LetsConnectRegistrationSheet />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
