"use client";

import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCredits } from "@/lib/utils";
import type { AdminUser } from "@/lib/types/components";

type UserManagementTableProps = {
  users: AdminUser[];
  onSuspend?: (id: string) => void;
  onUnsuspend?: (id: string) => void;
  onView?: (user: AdminUser) => void;
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-destructive/20 text-destructive",
  admin: "bg-orange-500/20 text-orange-400",
  developer: "bg-violet-glow/20 text-violet-electric",
  team_admin: "bg-cyan-aurora/20 text-cyan-aurora",
  creator: "bg-emerald-500/20 text-emerald-400",
  user: "bg-muted text-muted-foreground",
};

export function UserManagementTable({
  users,
  onSuspend,
  onUnsuspend,
  onView,
}: UserManagementTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage user accounts and roles</CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">User</th>
                  <th className="pb-3 pr-4 font-medium">Role</th>
                  <th className="pb-3 pr-4 font-medium">Credits</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border/40 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{user.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant="secondary"
                        className={cn("capitalize", ROLE_COLORS[user.role] ?? ROLE_COLORS.user)}
                      >
                        {user.role.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {user.creditBalance != null ? formatCredits(user.creditBalance) : "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={user.suspended ? "destructive" : "secondary"}>
                        {user.suspended ? "Suspended" : "Active"}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {onView && (
                          <Button variant="ghost" size="sm" onClick={() => onView(user)}>
                            View
                          </Button>
                        )}
                        {user.suspended
                          ? onUnsuspend && (
                              <Button variant="outline" size="sm" onClick={() => onUnsuspend(user.id)}>
                                Unsuspend
                              </Button>
                            )
                          : onSuspend && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onSuspend(user.id)}
                              >
                                Suspend
                              </Button>
                            )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
