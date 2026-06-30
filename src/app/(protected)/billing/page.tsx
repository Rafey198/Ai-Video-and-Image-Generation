"use client";

import { useEffect, useState } from "react";
import { Check, CreditCard, Zap } from "lucide-react";

import { PricingCards, type PricingTier } from "@/components/marketing/PricingCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCredits } from "@/lib/utils";

const CREDIT_PACKS = [
  { id: "pack-500", credits: 500, price: 9, popular: false },
  { id: "pack-2000", credits: 2000, price: 29, popular: true },
  { id: "pack-10000", credits: 10000, price: 99, popular: false },
];

const PLAN_TIERS: PricingTier[] = [
  {
    id: "creator",
    name: "Creator",
    description: "For individual creators",
    price: 19,
    interval: "month",
    credits: 2000,
    features: ["All studios", "HD exports", "Priority queue", "Email support"],
    ctaLabel: "Upgrade",
    ctaHref: "#",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For power users",
    price: 49,
    interval: "month",
    credits: 8000,
    features: ["4K exports", "API access", "Team sharing", "Priority support"],
    highlighted: true,
    ctaLabel: "Upgrade",
    ctaHref: "#",
  },
  {
    id: "studio",
    name: "Studio",
    description: "For teams",
    price: 149,
    interval: "month",
    credits: 30000,
    features: ["Unlimited seats", "Custom models", "SLA", "Dedicated support"],
    ctaLabel: "Contact sales",
    ctaHref: "/enterprise",
  },
];

export default function BillingPage() {
  const [balance, setBalance] = useState(0);
  const [monthlyUsed, setMonthlyUsed] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(2000);
  const [plan, setPlan] = useState("Free");

  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((data) => {
        setBalance(data.balance ?? data.wallet?.balance ?? 0);
        setMonthlyUsed(data.monthlyUsed ?? 0);
        setMonthlyLimit(data.monthlyLimit ?? 2000);
        setPlan(data.plan ?? "Free");
      })
      .catch(() => {});
  }, []);

  const usagePercent = monthlyLimit > 0 ? Math.min(100, (monthlyUsed / monthlyLimit) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Credits</h1>
        <p className="text-muted-foreground">Manage your plan, credits, and usage</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credit balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">{formatCredits(balance)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{plan}</p>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm tabular-nums">
              {formatCredits(monthlyUsed)} / {formatCredits(monthlyLimit)}
            </p>
            <Progress value={usagePercent} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Credit packs</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <Card
              key={pack.id}
              className={`border-border/60 bg-card/50 ${pack.popular ? "border-primary/40 shadow-neon-sm" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-aurora" />
                    {formatCredits(pack.credits)} credits
                  </CardTitle>
                  {pack.popular && <Badge className="bg-aurora">Popular</Badge>}
                </div>
                <CardDescription>${pack.price} one-time</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant={pack.popular ? "default" : "outline"}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Subscription plans</h2>
        <PricingCards tiers={PLAN_TIERS} title="" subtitle="" />
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Check className="h-5 w-5 text-emerald-400" />
            What&apos;s included
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p>✓ Credits never expire on paid plans</p>
          <p>✓ Unused subscription credits roll over</p>
          <p>✓ Secure payment via Stripe</p>
          <p>✓ Cancel anytime</p>
        </CardContent>
      </Card>
    </div>
  );
}
