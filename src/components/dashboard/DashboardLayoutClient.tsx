"use client";

import { signOut } from "next-auth/react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { CreditInfo, DashboardUser, NotificationItem } from "@/lib/types/components";

type DashboardLayoutClientProps = {
  children: React.ReactNode;
  user: DashboardUser;
  credits: CreditInfo;
  notifications: NotificationItem[];
};

export function DashboardLayoutClient({
  children,
  user,
  credits,
  notifications,
}: DashboardLayoutClientProps) {
  return (
    <DashboardShell
      user={user}
      credits={credits}
      notifications={notifications}
      onSignOut={() => signOut({ callbackUrl: "/login" })}
    >
      {children}
    </DashboardShell>
  );
}
