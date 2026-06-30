"use client";

import { useState } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminShell({ children, className }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground dark">
      <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className={cn("flex-1 overflow-y-auto p-6", className)}>{children}</main>
    </div>
  );
}
