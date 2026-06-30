import { Prisma, TransactionType } from "@prisma/client";

import { FREE_TRIAL_CREDITS } from "@/config/site";
import { prisma } from "@/lib/db/prisma";

export class InsufficientCreditsError extends Error {
  constructor(
    public readonly balance: number,
    public readonly required: number
  ) {
    super(`Insufficient credits: have ${balance}, need ${required}`);
    this.name = "InsufficientCreditsError";
  }
}

export class WalletNotFoundError extends Error {
  constructor(userId: string) {
    super(`Credit wallet not found for user ${userId}`);
    this.name = "WalletNotFoundError";
  }
}

async function ensureWallet(
  tx: Prisma.TransactionClient,
  userId: string
) {
  return tx.creditWallet.upsert({
    where: { userId },
    create: { userId, balance: 0 },
    update: {},
  });
}

export async function getBalance(userId: string): Promise<number> {
  const wallet = await prisma.creditWallet.findUnique({
    where: { userId },
    select: { balance: true },
  });

  return wallet?.balance ?? 0;
}

export async function getOrCreateWallet(userId: string, grantTrial = false) {
  const existing = await prisma.creditWallet.findUnique({
    where: { userId },
  });

  if (existing) {
    return existing;
  }

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.creditWallet.create({
      data: {
        userId,
        balance: grantTrial ? FREE_TRIAL_CREDITS : 0,
      },
    });

    if (grantTrial && FREE_TRIAL_CREDITS > 0) {
      await tx.creditTransaction.create({
        data: {
          userId,
          amount: FREE_TRIAL_CREDITS,
          type: TransactionType.bonus,
          description: "Welcome bonus credits",
        },
      });
    }

    return wallet;
  });
}

export async function deductCredits(params: {
  userId: string;
  amount: number;
  jobId?: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  const { userId, amount, jobId, description, metadata } = params;

  if (amount <= 0) {
    throw new Error("Deduction amount must be positive");
  }

  return prisma.$transaction(async (tx) => {
    const wallet = await ensureWallet(tx, userId);

    if (wallet.balance < amount) {
      throw new InsufficientCreditsError(wallet.balance, amount);
    }

    const updated = await tx.creditWallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        type: TransactionType.generation,
        description: description ?? "Generation credit deduction",
        jobId,
        metadata,
      },
    });

    return updated;
  });
}

export async function refundCredits(params: {
  userId: string;
  amount: number;
  jobId?: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  const { userId, amount, jobId, description, metadata } = params;

  if (amount <= 0) {
    throw new Error("Refund amount must be positive");
  }

  return prisma.$transaction(async (tx) => {
    await ensureWallet(tx, userId);

    const updated = await tx.creditWallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount,
        type: TransactionType.refund,
        description: description ?? "Generation credit refund",
        jobId,
        metadata,
      },
    });

    return updated;
  });
}

export async function grantCredits(params: {
  userId: string;
  amount: number;
  type?: Extract<TransactionType, "admin_grant" | "purchase" | "subscription" | "bonus">;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  const {
    userId,
    amount,
    type = TransactionType.admin_grant,
    description,
    metadata,
  } = params;

  if (amount <= 0) {
    throw new Error("Grant amount must be positive");
  }

  return prisma.$transaction(async (tx) => {
    await ensureWallet(tx, userId);

    const updated = await tx.creditWallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount,
        type,
        description: description ?? "Credits granted",
        metadata,
      },
    });

    return updated;
  });
}
