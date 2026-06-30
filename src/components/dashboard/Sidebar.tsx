"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DASHBOARD_NAV, SITE_CONFIG } from "@/config/site";
import { cn } from "@/lib/utils";
import { getNavIcon } from "@/components/dashboard/nav-icons";

type SidebarProps = {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-border/60 bg-card/40 backdrop-blur-md transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <div className="flex h-14 items-center justify-between px-3">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 px-2">
              <div className="h-8 w-8 rounded-lg bg-aurora shadow-neon-sm" />
              <span className="font-semibold tracking-tight">{SITE_CONFIG.name}</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("shrink-0", collapsed && "mx-auto")}
            onClick={() => onCollapsedChange?.(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <Separator className="bg-border/60" />

        <ScrollArea className="flex-1 px-2 py-3">
          <nav className="flex flex-col gap-1">
            {DASHBOARD_NAV.map((item) => {
              const Icon = getNavIcon(item.icon);
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              const link = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary shadow-neon-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.href}>{link}</div>;
            })}
          </nav>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
}
