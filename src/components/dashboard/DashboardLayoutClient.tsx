"use client";

import { signOut } from "next-auth/react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { CreditInfo, DashboardUser, NotificationItem } from "@/lib/types/components";

type DashboardLayoutClientProps = {
  children: React.ReactNode;
  user: DashboardUser;
  credits: CreditInfo;
  notifications: NotificationItem[];
  demoMode?: boolean;
};

export function DashboardLayoutClient({
  children,
  user,
  credits,
  notifications,
  demoMode,
}: DashboardLayoutClientProps) {
  return (
    <DashboardShell
      user={user}
      credits={credits}
      notifications={notifications}
      demoMode={demoMode}
      onSignOut={() => signOut({ callbackUrl: "/login" })}
    >
      {children}
    </DashboardShell>
  );
}
