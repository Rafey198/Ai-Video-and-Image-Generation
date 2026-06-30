import type { TemplateDesignJson } from "../types";

export function designToHtml(design: TemplateDesignJson, watermark = false): string {
  const primary = design.colorPalette[0] ?? "#0F172A";
  const accent = design.colorPalette[1] ?? "#3B82F6";
  const text = design.colorPalette[4] ?? "#F8FAFC";

  const sectionsHtml = design.sections
    .map(
      (s) => `
      <section class="block">
        <h2 style="color:${accent}">${escapeHtml(s.heading)}</h2>
        ${s.items?.length ? `<ul>${s.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : `<p>${escapeHtml(s.body)}</p>`}
      </section>`
    )
    .join("");

  const pricingHtml = design.pricing
    .map(
      (p) => `
      <div class="price-card ${p.highlighted ? "highlighted" : ""}">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="price">${escapeHtml(p.price)}${p.period ? `<span>${escapeHtml(p.period)}</span>` : ""}</div>
        <ul>${p.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
      </div>`
    )
    .join("");

  const faqHtml = design.faq
    .map(
      (f) => `
      <div class="faq-item">
        <strong>${escapeHtml(f.question)}</strong>
        <p>${escapeHtml(f.answer)}</p>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Inter, Arial, sans-serif; background: ${primary}; color: ${text}; padding: 48px; line-height: 1.6; }
    .hero { margin-bottom: 40px; border-bottom: 2px solid ${accent}; padding-bottom: 24px; }
    .hero h1 { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
    .hero .subtitle { font-size: 18px; opacity: 0.85; }
    .meta { display: flex; gap: 24px; margin-top: 16px; font-size: 13px; opacity: 0.7; }
    .block { margin-bottom: 28px; }
    .block h2 { font-size: 20px; margin-bottom: 8px; }
    .block p, .block li { font-size: 14px; opacity: 0.9; }
    .block ul { padding-left: 20px; }
    .pricing { display: flex; gap: 16px; margin: 32px 0; }
    .price-card { flex: 1; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.1); }
    .price-card.highlighted { border-color: ${accent}; background: rgba(255,255,255,0.08); }
    .price-card h3 { font-size: 16px; margin-bottom: 8px; }
    .price { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
    .price span { font-size: 14px; font-weight: 400; opacity: 0.7; }
    .price-card ul { list-style: none; padding: 0; }
    .price-card li { font-size: 13px; padding: 4px 0; }
    .price-card li::before { content: "✓ "; color: ${accent}; }
    .faq { margin-top: 32px; }
    .faq-item { margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; }
    .cta { text-align: center; margin-top: 40px; padding: 32px; background: ${accent}; border-radius: 16px; }
    .cta h2 { font-size: 28px; color: #fff; }
    .watermark { position: fixed; bottom: 20px; right: 20px; opacity: 0.3; font-size: 12px; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${escapeHtml(design.title)}</h1>
    <p class="subtitle">${escapeHtml(design.subtitle)}</p>
    <div class="meta">
      <span>${escapeHtml(design.industry)}</span>
      <span>${escapeHtml(design.targetAudience)}</span>
      <span>${escapeHtml(design.brandStyle)}</span>
    </div>
  </div>
  ${sectionsHtml}
  <div class="pricing">${pricingHtml}</div>
  <div class="faq">${faqHtml}</div>
  <div class="cta"><h2>${escapeHtml(design.cta)}</h2></div>
  ${watermark ? '<div class="watermark">Created with VireoMorph</div>' : ""}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function htmlToPdfBuffer(html: string): Promise<Buffer> {
  const workerUrl = process.env.EXPORT_WORKER_URL ?? process.env.CUSTOM_WORKER_ENDPOINT;

  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl.replace(/\/$/, "")}/export/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.CUSTOM_WORKER_API_KEY
            ? { Authorization: `Bearer ${process.env.CUSTOM_WORKER_API_KEY}` }
            : {}),
        },
        body: JSON.stringify({ html }),
      });

      if (res.ok) {
        return Buffer.from(await res.arrayBuffer());
      }
    } catch {
      // fall through to local fallback
    }
  }

  // Fallback: return HTML as buffer (worker should handle in production)
  return Buffer.from(html, "utf-8");
}

export async function htmlToPngBuffer(html: string): Promise<Buffer> {
  const workerUrl = process.env.EXPORT_WORKER_URL ?? process.env.CUSTOM_WORKER_ENDPOINT;

  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl.replace(/\/$/, "")}/export/png`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.CUSTOM_WORKER_API_KEY
            ? { Authorization: `Bearer ${process.env.CUSTOM_WORKER_API_KEY}` }
            : {}),
        },
        body: JSON.stringify({ html, width: 1080, height: 1350 }),
      });

      if (res.ok) {
        return Buffer.from(await res.arrayBuffer());
      }
    } catch {
      // fall through
    }
  }

  return Buffer.from(html, "utf-8");
}
