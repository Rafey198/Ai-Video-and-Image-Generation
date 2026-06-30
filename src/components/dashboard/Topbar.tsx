"use client";

import Link from "next/link";
import { LogOut, Search, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CreditBadge } from "@/components/dashboard/CreditBadge";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { getInitials } from "@/lib/utils";
import type { CreditInfo, DashboardUser, NotificationItem } from "@/lib/types/components";

type TopbarProps = {
  user?: DashboardUser | null;
  credits?: CreditInfo;
  notifications?: NotificationItem[];
  onSearch?: (query: string) => void;
  onSignOut?: () => void;
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
};

export function Topbar({
  user,
  credits,
  notifications = [],
  onSearch,
  onSignOut,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}: TopbarProps) {
  const displayName = user?.name ?? user?.email ?? "User";

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border/60 bg-card/30 px-4 backdrop-blur-md">
      <form
        className="relative flex-1 max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSearch?.(String(formData.get("q") ?? ""));
        }}
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          placeholder="Search projects, prompts, media..."
          className="border-border/60 bg-background/50 pl-9"
        />
      </form>

      <div className="flex items-center gap-2">
        {credits && <CreditBadge balance={credits.balance} />}

        <NotificationBell
          notifications={notifications}
          onMarkRead={onMarkNotificationRead}
          onMarkAllRead={onMarkAllNotificationsRead}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image ?? undefined} alt={displayName} />
                <AvatarFallback className="bg-primary/20 text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">{displayName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name ?? "Account"}</span>
                {user?.email && (
                  <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
