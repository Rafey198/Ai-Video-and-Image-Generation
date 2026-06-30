import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { JobError } from "@/lib/ai/jobs";
import { AuthError } from "@/lib/auth/session";
import {
  InsufficientCreditsError,
  WalletNotFoundError,
} from "@/lib/credits/wallet";

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(
  message: string,
  status = 400,
  extra?: Record<string, unknown>
) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof AuthError) {
    return errorResponse(error.message, error.statusCode);
  }

  if (error instanceof JobError) {
    return errorResponse(error.message, error.statusCode, { code: error.code });
  }

  if (error instanceof InsufficientCreditsError) {
    return errorResponse(error.message, 402, {
      code: "INSUFFICIENT_CREDITS",
      balance: error.balance,
      required: error.required,
    });
  }

  if (error instanceof WalletNotFoundError) {
    return errorResponse(error.message, 404, { code: "WALLET_NOT_FOUND" });
  }

  if (error instanceof ZodError) {
    const first = error.errors[0];
    const message = first
      ? `${first.path.join(".") || "request"}: ${first.message}`
      : "Validation failed";
    return errorResponse(message, 422, {
      issues: error.flatten().fieldErrors,
    });
  }

  console.error("[API]", error);
  return errorResponse("Internal server error", 500);
}

export function rateLimitHeaders(result: {
  limit: number;
  remaining: number;
  resetAt: number;
}) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}
