"use client";

import { useEffect, useState } from "react";

import { UserManagementTable } from "@/components/admin/UserManagementTable";
import type { AdminUser } from "@/lib/types/components";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  function loadUsers() {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users ?? data ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage accounts, roles, and suspensions</p>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading users...</p>
      ) : (
        <UserManagementTable
          users={users}
          onSuspend={(id) => {
            fetch(`/api/admin/users?id=${id}`, { method: "PATCH", body: JSON.stringify({ suspended: true }) });
            loadUsers();
          }}
          onUnsuspend={(id) => {
            fetch(`/api/admin/users?id=${id}`, { method: "PATCH", body: JSON.stringify({ suspended: false }) });
            loadUsers();
          }}
        />
      )}
    </div>
  );
}
