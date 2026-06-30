import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STUDIO_SECTIONS } from "@/lib/digital-product/constants";

const TEST_PROMPTS: Record<string, string> = {
  "one-pager": "Gold trading analysis chart — premium fintech one-pager for startup funding",
  business: "SaaS project management tool for remote teams — business plan summary",
  brochure: "Luxury real estate agency — tri-fold brochure for high-end properties",
  logo: "Business name: ApexTrade. Tagline: Markets made simple. Fintech, minimal blue palette",
  excel: "Freelance income and expense tracker with monthly dashboard",
  planner: "Weekly productivity planner for entrepreneurs with habit tracking",
  bulk: "Complete startup kit for an AI SaaS company targeting small businesses",
};

const STEPS = [
  "Use your production Vercel URL (not a long preview URL).",
  "Disable Vercel Deployment Protection (Settings → Deployment Protection).",
  "Set DATABASE_URL, OPENAI_API_KEY, NEXTAUTH_URL on Vercel and redeploy.",
  "Run: npx prisma db push && npm run db:seed (includes digital product tables).",
  "Digital Product works with Demo Mode ON or OFF — it uses OpenAI + your database.",
];

export function DigitalProductTestGuide() {
  const generators = STUDIO_SECTIONS.filter((s) => s.type);

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Live testing checklist
        </CardTitle>
        <CardDescription>
          Test every generator below with real AI output. Gallery and Dashboard show saved results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium text-destructive">Before you test</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Generators — open each link, paste the prompt, click Generate</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {generators.map((section) => (
              <div
                key={section.id}
                className="rounded-lg border border-border/60 bg-card/50 p-3 text-sm"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Link href={section.href} className="font-medium text-primary hover:underline">
                    {section.title}
                  </Link>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {section.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{section.description}</p>
                <p className="mt-2 rounded-md bg-background/60 p-2 font-mono text-xs leading-relaxed">
                  {TEST_PROMPTS[section.id] ?? "VireoMorph live test — professional template"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-card/50 p-3 text-sm">
            <p className="font-medium">Template Gallery</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Open after generating at least one template. Filter by type and open in editor.
            </p>
            <Link href="/digital-product/gallery" className="mt-2 inline-block text-xs text-primary hover:underline">
              /digital-product/gallery →
            </Link>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/50 p-3 text-sm">
            <p className="font-medium">My Dashboard</p>
            <p className="mt-1 text-xs text-muted-foreground">
              View history, favorites, and re-export PDF / PPTX / ZIP downloads.
            </p>
            <Link href="/digital-product/dashboard" className="mt-2 inline-block text-xs text-primary hover:underline">
              /digital-product/dashboard →
            </Link>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Image / Video / Audio / Sync models: Admin →{" "}
          <Link href="/admin/model-tests" className="text-primary hover:underline">
            Live Model Tests
          </Link>{" "}
          (turn Demo Mode OFF, set REPLICATE_API_TOKEN).
        </p>
      </CardContent>
    </Card>
  );
}
