"use client";

// import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/header";
import KnowledgeBaseSidebar from "./sidemenu";
// import { useAuth } from "@/app/contexts/auth-context";
// import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login";

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <KnowledgeBaseSidebar />
      <SidebarInset>
        <Header />
        <main className="container mx-auto min-h-screen pt-20">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
