"use client";

import { useEffect, useState } from "react";

import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminUser } from "@/lib/types/components";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function loadUsers() {
    setLoading(true);
    setError(null);
    fetch("/api/admin/users")
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load users");
        return r.json();
      })
      .then((data) => setUsers(data.users ?? []))
      .catch(() => {
        setUsers([]);
        setError("Unable to load users. Check your connection and admin permissions.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function patchUser(userId: string, body: Record<string, unknown>) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...body }),
    });
    if (!res.ok) throw new Error("Update failed");
    loadUsers();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage accounts, roles, credits, and suspensions</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={Users}
          title="Could not load users"
          description={error}
          actionLabel="Retry"
          onAction={loadUsers}
        />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Seed the database or adjust filters." />
      ) : (
        <UserManagementTable
          users={users}
          onSuspend={(id) => void patchUser(id, { suspended: true })}
          onUnsuspend={(id) => void patchUser(id, { suspended: false })}
        />
      )}
    </div>
  );
}
