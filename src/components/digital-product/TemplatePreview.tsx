"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import type { TemplateDesignJson } from "@/lib/digital-product/types";

type TemplatePreviewProps = {
  design: TemplateDesignJson;
  className?: string;
};

export function TemplatePreview({ design, className }: TemplatePreviewProps) {
  const primary = design.colorPalette[0] ?? "#0F172A";
  const accent = design.colorPalette[1] ?? "#3B82F6";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`overflow-hidden rounded-xl border border-border/60 shadow-2xl ${className ?? ""}`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative p-6 transition-transform hover:rotate-y-1"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${primary}ee 50%, ${accent}22 100%)`,
          color: design.colorPalette[4] ?? "#F8FAFC",
          minHeight: 400,
        }}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="border-white/20 text-xs">{design.industry}</Badge>
          <Badge variant="outline" className="border-white/20 text-xs">{design.brandStyle}</Badge>
        </div>

        <h2 className="text-2xl font-bold leading-tight">{design.title}</h2>
        <p className="mt-1 text-sm opacity-80">{design.subtitle}</p>

        <div className="mt-6 space-y-4">
          {design.sections.slice(0, 4).map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-semibold" style={{ color: accent }}>{section.heading}</h3>
              {section.items ? (
                <ul className="mt-1 space-y-0.5 text-xs opacity-80">
                  {section.items.slice(0, 3).map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs opacity-80 line-clamp-2">{section.body}</p>
              )}
            </div>
          ))}
        </div>

        {design.pricing.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-2">
            {design.pricing.slice(0, 3).map((tier) => (
              <div
                key={tier.name}
                className="rounded-lg p-2 text-center text-xs"
                style={{
                  background: tier.highlighted ? `${accent}33` : "rgba(255,255,255,0.05)",
                  border: tier.highlighted ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="font-semibold">{tier.name}</div>
                <div className="text-lg font-bold">{tier.price}</div>
              </div>
            ))}
          </div>
        )}

        <div
          className="mt-6 rounded-lg py-3 text-center text-sm font-bold"
          style={{ background: accent, color: "#fff" }}
        >
          {design.cta}
        </div>

        <div className="mt-4 flex gap-1">
          {design.colorPalette.map((color) => (
            <div
              key={color}
              className="h-4 w-4 rounded-full border border-white/20"
              style={{ background: color }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
