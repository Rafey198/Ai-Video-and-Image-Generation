import { JobStatus } from "@prisma/client";

import { handleApiError, json } from "@/lib/api/handler";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersToday,
      newUsersWeek,
      suspendedUsers,
      totalJobs,
      jobsByStatus,
      jobsToday,
      totalAssets,
      totalCreditsIssued,
      activeModels,
      totalProviders,
      recentErrors,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: dayAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { suspended: true } }),
      prisma.generationJob.count(),
      prisma.generationJob.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.generationJob.count({ where: { createdAt: { gte: dayAgo } } }),
      prisma.mediaAsset.count(),
      prisma.creditTransaction.aggregate({
        where: { amount: { gt: 0 } },
        _sum: { amount: true },
      }),
      prisma.aiModel.count({ where: { enabled: true } }),
      prisma.modelProvider.count({ where: { enabled: true } }),
      prisma.generationJob.count({
        where: {
          status: JobStatus.failed,
          createdAt: { gte: dayAgo },
        },
      }),
    ]);

    const statusMap = Object.fromEntries(
      jobsByStatus.map((row) => [row.status, row._count.status])
    ) as Record<JobStatus, number>;

    return json({
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersWeek,
        suspended: suspendedUsers,
      },
      jobs: {
        total: totalJobs,
        today: jobsToday,
        byStatus: statusMap,
        failedToday: recentErrors,
      },
      assets: { total: totalAssets },
      credits: { totalIssued: totalCreditsIssued._sum.amount ?? 0 },
      models: { active: activeModels },
      providers: { active: totalProviders },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
