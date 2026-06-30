import { handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { isStripeConfigured } from "@/lib/config/env";

export async function GET() {
  try {
    await requireAuth();

    return json({
      paymentsConfigured: isStripeConfigured(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
