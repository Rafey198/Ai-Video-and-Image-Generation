"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CreditInfo, DashboardUser, NotificationItem } from "@/lib/types/components";

type DashboardShellProps = {
  children: React.ReactNode;
  user?: DashboardUser | null;
  credits?: CreditInfo;
  notifications?: NotificationItem[];
  onSearch?: (query: string) => void;
  onSignOut?: () => void;
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  className?: string;
};

export function DashboardShell({
  children,
  user,
  credits,
  notifications,
  onSearch,
  onSignOut,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  className,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground dark">
      <div className="hidden md:flex">
        <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative h-full w-72 shadow-glass">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              aria-label="Close menu"
              onClick={() => setMobileNavOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Sidebar collapsed={false} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="m-2"
            aria-label="Open navigation menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <Topbar
          user={user}
          credits={credits}
          notifications={notifications}
          onSearch={onSearch}
          onSignOut={onSignOut}
          onMarkNotificationRead={onMarkNotificationRead}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
        />
        <main className={cn("flex-1 overflow-y-auto p-4 md:p-6", className)}>{children}</main>
      </div>
    </div>
  );
}
