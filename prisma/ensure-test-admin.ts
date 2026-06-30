/**
 * Upsert the test admin account without wiping the database.
 * Safe to run on production Neon after deploy.
 *
 * Usage: npm run db:ensure-test-admin
 */
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const TEST_ADMIN_EMAIL = "admin@vireomorph.dev";
export const TEST_ADMIN_PASSWORD = "Admin123!";

const ADMIN_CREDITS = 999_999;

async function ensureEnterprisePlan() {
  const existing = await prisma.plan.findUnique({ where: { slug: "enterprise" } });
  if (existing) return existing;

  return prisma.plan.create({
    data: {
      name: "Enterprise",
      slug: "enterprise",
      description: "Unlimited testing and team features",
      monthlyCredits: 100_000,
      priceMonthly: 0,
      priceYearly: 0,
      maxTeamMembers: 100,
      features: { all_models: true, priority: true },
      sortOrder: 99,
      active: true,
    },
  });
}

async function main() {
  console.log("🔧 Ensuring test admin account…");

  const passwordHash = await bcrypt.hash(TEST_ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: TEST_ADMIN_EMAIL },
    create: {
      name: "VireoMorph Test Admin",
      email: TEST_ADMIN_EMAIL,
      passwordHash,
      role: UserRole.super_admin,
      emailVerified: new Date(),
      suspended: false,
    },
    update: {
      name: "VireoMorph Test Admin",
      passwordHash,
      role: UserRole.super_admin,
      suspended: false,
    },
  });

  await prisma.creditWallet.upsert({
    where: { userId: admin.id },
    create: { userId: admin.id, balance: ADMIN_CREDITS },
    update: { balance: ADMIN_CREDITS },
  });

  const enterprisePlan = await ensureEnterprisePlan();

  await prisma.subscription.deleteMany({ where: { userId: admin.id } });
  await prisma.subscription.create({
    data: {
      userId: admin.id,
      planId: enterprisePlan.id,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.featureFlag.upsert({
    where: { key: "demo_mode" },
    create: {
      key: "demo_mode",
      name: "Demo Mode",
      description: "Use mock providers and placeholder outputs",
      enabled: false,
    },
    update: { enabled: false },
  });

  const modelCount = await prisma.aiModel.count({ where: { enabled: true } });

  console.log("");
  console.log("✅ Test admin ready for live model testing (demo mode OFF)");
  console.log(`   Email:    ${TEST_ADMIN_EMAIL}`);
  console.log(`   Password: ${TEST_ADMIN_PASSWORD}`);
  console.log(`   Role:     super_admin`);
  console.log(`   Credits:  ${ADMIN_CREDITS.toLocaleString()}`);
  console.log(`   Plan:     enterprise`);
  console.log(`   Models:   ${modelCount} enabled in registry`);
  console.log("");
  console.log("Next: sign in → Admin → Live Model Tests → Run all mapped");
  console.log("Requires REPLICATE_API_TOKEN + S3/R2 on Vercel when demo is off.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
