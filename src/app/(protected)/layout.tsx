import { redirect } from "next/navigation";

import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [wallet, notifications] = await Promise.all([
    prisma.creditWallet.findUnique({ where: { userId: session.user.id } }),
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <DashboardLayoutClient
      user={session.user}
      credits={{ balance: wallet?.balance ?? 0 }}
      notifications={notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.read,
        link: n.link,
        createdAt: n.createdAt,
      }))}
    >
      {children}
    </DashboardLayoutClient>
  );
}
