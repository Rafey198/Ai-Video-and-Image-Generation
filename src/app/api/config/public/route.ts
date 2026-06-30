import { handleApiError, json } from "@/lib/api/handler";
import { getDemoMode } from "@/lib/config/runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const demoMode = await getDemoMode();
    return json({ demoMode });
  } catch (error) {
    return handleApiError(error);
  }
}
