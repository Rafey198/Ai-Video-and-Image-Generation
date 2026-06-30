"use client";

import Link from "next/link";
import { Coins } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCredits } from "@/lib/utils";
import { cn } from "@/lib/utils";

type CreditBadgeProps = {
  balance: number;
  href?: string;
  className?: string;
  showLabel?: boolean;
};

export function CreditBadge({
  balance,
  href = "/billing",
  className,
  showLabel = true,
}: CreditBadgeProps) {
  const content = (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-violet-glow/30 bg-violet-glow/10 px-2.5 py-1 text-violet-electric hover:bg-violet-glow/20",
        href && "cursor-pointer transition-colors",
        className
      )}
    >
      <Coins className="h-3.5 w-3.5" />
      <span className="font-semibold tabular-nums">{formatCredits(balance)}</span>
      {showLabel && <span className="text-muted-foreground">credits</span>}
    </Badge>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label={`${formatCredits(balance)} credits`}>
      {content}
    </Link>
  );
}
