import { handleApiError, json } from "@/lib/api/handler";
import { isGoogleOAuthConfigured } from "@/lib/config/env";
import { getDemoMode } from "@/lib/config/runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const demoMode = await getDemoMode();
    return json({
      demoMode,
      googleOAuthEnabled: isGoogleOAuthConfigured(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
