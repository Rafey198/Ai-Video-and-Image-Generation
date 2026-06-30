import bcrypt from "bcryptjs";
import { TransactionType } from "@prisma/client";

import { errorResponse, handleApiError, json, rateLimitHeaders } from "@/lib/api/handler";
import { prisma } from "@/lib/db/prisma";
import { FREE_TRIAL_CREDITS, RATE_LIMITS } from "@/config/site";
import { rateLimitByIp } from "@/lib/security/rate-limit";
import { signupSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const rateLimit = rateLimitByIp(request, "auth:signup", RATE_LIMITS.auth);
    if (!rateLimit.success) {
      return errorResponse("Too many signup attempts. Please try again later.", 429);
    }

    const body = await request.json();
    const data = signupSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return errorResponse("An account with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      await tx.creditWallet.create({
        data: {
          userId: created.id,
          balance: FREE_TRIAL_CREDITS,
        },
      });

      if (FREE_TRIAL_CREDITS > 0) {
        await tx.creditTransaction.create({
          data: {
            userId: created.id,
            amount: FREE_TRIAL_CREDITS,
            type: TransactionType.bonus,
            description: "Welcome bonus credits",
          },
        });
      }

      return created;
    });

    const response = json(
      {
        user,
        wallet: { balance: FREE_TRIAL_CREDITS },
        message: "Account created successfully",
      },
      201
    );

    Object.entries(rateLimitHeaders(rateLimit)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
