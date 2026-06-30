"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminShell({ children, className }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground dark">
      <div className="hidden md:flex">
        <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
            <AdminSidebar collapsed={false} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center border-b border-border/60 px-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open admin navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm font-semibold">Admin Console</span>
        </div>
        <main className={cn("flex-1 overflow-y-auto p-4 md:p-6", className)}>{children}</main>
      </div>
    </div>
  );
}
