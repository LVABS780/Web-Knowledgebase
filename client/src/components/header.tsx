"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/contexts/auth-context";
import { BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="border border-black/30 size-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-800 to-blue-600 text-white font-extrabold text-2xl">
                  {user?.name!.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-52"
              align="end"
            >
              <DropdownMenuItem
                onClick={logout}
                className="text-red-500"
              >
                {isAuthenticated ? "Logout" : "Login"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
