import Link from "next/link";

import { SITE_CONFIG } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(34,211,238,0.1),_transparent_50%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-violet-glow/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-cyan-aurora/10 blur-3xl" />

      <Link href="/" className="relative z-10 mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-aurora shadow-neon-sm" />
        <div>
          <p className="text-lg font-semibold tracking-tight">{SITE_CONFIG.name}</p>
          <p className="text-xs text-muted-foreground">{SITE_CONFIG.tagline}</p>
        </div>
      </Link>

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
