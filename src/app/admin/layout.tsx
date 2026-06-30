import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { getSession, isAdminRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
