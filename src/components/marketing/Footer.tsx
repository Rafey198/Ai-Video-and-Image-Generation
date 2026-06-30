import Link from "next/link";
import { Github, MessageCircle, Sparkles, Twitter, Youtube } from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG, SOCIAL_LINKS } from "@/config/site";
import { Separator } from "@/components/ui/separator";

const SOCIAL_ICONS = {
  Twitter,
  Github,
  MessageCircle,
  Youtube,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-aurora shadow-neon-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-violet-electric to-cyan-aurora bg-clip-text text-lg font-bold text-transparent">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-card/40 text-muted-foreground backdrop-blur-sm transition-colors hover:border-violet-glow/40 hover:text-violet-electric"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-border/40" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">{SITE_CONFIG.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
