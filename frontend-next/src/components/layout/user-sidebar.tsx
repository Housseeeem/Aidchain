"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/auth-context";
import {
  BarChart3,
  Upload,
  Settings,
  LogOut,
  Home,
  CheckCircle,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Upload Dataset",
    href: "/upload",
    icon: Upload,
  },
  {
    title: "Approvals",
    href: "/approvals",
    icon: CheckCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function UserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-background border-r flex flex-col">
      {/* User Info */}
      {user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_img} alt={user.username} />
              <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
