import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";

import { ADMIN_ROLES } from "@/config/site";
import { authOptions } from "@/lib/auth/auth";

export type AuthSession = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: UserRole;
  };
};

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session as AuthSession;
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Authentication required");
  }
  return session;
}

export function isAdminRole(role: UserRole): boolean {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}

export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth();
  if (!isAdminRole(session.user.role)) {
    throw new AuthError("Admin access required", 403);
  }
  return session;
}
