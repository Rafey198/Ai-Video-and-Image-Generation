"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/lib/types/components";

type NotificationBellProps = {
  notifications: NotificationItem[];
  unreadCount?: number;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
};

export function NotificationBell({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
}: NotificationBellProps) {
  const count = unreadCount ?? notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {count > 0 && onMarkAllRead && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-xs font-normal text-muted-foreground hover:text-foreground"
            >
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[280px]">
          {notifications.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No notifications yet
            </p>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex cursor-pointer flex-col items-start gap-0.5 p-3",
                  !notification.read && "bg-accent/50"
                )}
                onClick={() => onMarkRead?.(notification.id)}
                asChild={!!notification.link}
              >
                {notification.link ? (
                  <Link href={notification.link}>
                    <NotificationContent notification={notification} />
                  </Link>
                ) : (
                  <NotificationContent notification={notification} />
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="w-full justify-center text-center">
            View all
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationContent({ notification }: { notification: NotificationItem }) {
  return (
    <>
      <span className="text-sm font-medium">{notification.title}</span>
      <span className="line-clamp-2 text-xs text-muted-foreground">{notification.message}</span>
      <span className="text-[10px] text-muted-foreground/70">
        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
      </span>
    </>
  );
}
