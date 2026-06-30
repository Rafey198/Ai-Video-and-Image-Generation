"use client";

import { useState } from "react";
import { CreditCard, Gift, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCredits } from "@/lib/utils";

export default function AdminCreditsPage() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Credits & Billing</h1>
        <p className="text-muted-foreground">Grant credits and manage billing operations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-cyan-aurora" />
              Grant credits
            </CardTitle>
            <CardDescription>Manually add credits to a user account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID or email</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border-border/60 bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Credit amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-border/60 bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="e.g. Support compensation"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border-border/60 bg-background/50"
              />
            </div>
            <Button className="bg-aurora shadow-neon-sm">
              <Plus className="mr-2 h-4 w-4" />
              Grant credits
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Platform summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total credits in circulation</span>
              <span className="font-medium tabular-nums">{formatCredits(1_240_000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credits spent today</span>
              <span className="font-medium tabular-nums">{formatCredits(48_200)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active subscriptions</span>
              <span className="font-medium tabular-nums">342</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue (MTD)</span>
              <span className="font-medium tabular-nums">$24,180</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
