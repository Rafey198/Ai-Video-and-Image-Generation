"use client";

import { Coins } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { calculateCreditCost } from "@/lib/credits/calculator";
import { formatCredits } from "@/lib/utils";
import type { AiModelOption } from "@/lib/types/components";

type CreditEstimatorProps = {
  model: AiModelOption | null;
  durationSeconds?: number;
  resolution?: string;
  batchSize?: number;
  balance?: number;
};

export function CreditEstimator({
  model,
  durationSeconds = 0,
  resolution,
  batchSize = 1,
  balance,
}: CreditEstimatorProps) {
  if (!model) {
    return (
      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
        Select a model to estimate credits
      </div>
    );
  }

  const cost = calculateCreditCost({
    model: {
      creditCostBase: model.creditCostBase,
      creditCostPerSecond: model.creditCostPerSecond,
    },
    durationSeconds,
    resolution,
    batchSize,
  });

  const insufficient = balance != null && balance < cost;

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/50 p-4">
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-violet-electric" />
        <div>
          <p className="text-sm font-medium">Estimated cost</p>
          <p className="text-xs text-muted-foreground">
            Base {model.creditCostBase}
            {model.creditCostPerSecond > 0 && ` + ${model.creditCostPerSecond}/s`}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Badge
          variant={insufficient ? "destructive" : "secondary"}
          className="text-base font-semibold tabular-nums"
        >
          {formatCredits(cost)} credits
        </Badge>
        {insufficient && (
          <p className="mt-1 text-xs text-destructive">Insufficient balance</p>
        )}
      </div>
    </div>
  );
}
