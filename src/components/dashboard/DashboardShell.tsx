"use client";

import { useState } from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
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

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground dark">
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          user={user}
          credits={credits}
          notifications={notifications}
          onSearch={onSearch}
          onSignOut={onSignOut}
          onMarkNotificationRead={onMarkNotificationRead}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
        />
        <main className={cn("flex-1 overflow-y-auto p-6", className)}>{children}</main>
      </div>
    </div>
  );
}
