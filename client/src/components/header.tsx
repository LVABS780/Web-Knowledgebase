"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/contexts/auth-context";
import { BookOpen, CircleArrowOutUpRightIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-black z-50 sticky top-0 w-full flex items-center justify-between px-5 py-1 border-b shadow-md print:hidden">
      <div className="flex items-center justify-between h-14 px-4 gap-3 w-full">
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
          {isAuthenticated && (
            <Button
              variant="outline"
              size="icon"
              onClick={logout}
            >
              <CircleArrowOutUpRightIcon className="relative dark:absolute rotate-45 h-[1.2rem] w-[1.2rem] text-red-500 dark:text-red-400" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
