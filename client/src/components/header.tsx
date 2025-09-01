"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/contexts/auth-context";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 inset-x-0 z-50 w-full">
      <div className="flex items-center justify-between h-14 px-4 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold truncate">KnowledgeHub</span>
          </div>
        </div>
        <div className="flex-1 max-w-xl hidden md:flex">
          <Input
            placeholder="Search knowledge..."
            className="h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm hidden sm:inline">
                {user?.name || user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
            >
              <Link href="/admin/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
