"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/lib/types/components";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  function loadNotifications() {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications ?? data ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    loadNotifications();
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            All notifications
          </CardTitle>
          <CardDescription>Updates about your generations and account</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No notifications yet</p>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-4 py-4",
                    !n.read && "bg-primary/5 -mx-4 px-4 rounded-lg"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{n.title}</p>
                      {!n.read && <Badge variant="secondary" className="text-xs">New</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
