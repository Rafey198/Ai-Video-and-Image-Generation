import PptxGenJS from "pptxgenjs";

import type { TemplateDesignJson } from "../types";

export async function designToPptx(design: TemplateDesignJson): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.author = "VireoMorph";
  pptx.title = design.title;

  const slide = pptx.addSlide();
  const primary = design.colorPalette[0] ?? "#0F172A";
  const accent = design.colorPalette[1] ?? "#3B82F6";

  slide.background = { color: primary.replace("#", "") };

  slide.addText(design.title, {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 1,
    fontSize: 32,
    bold: true,
    color: "FFFFFF",
    fontFace: "Arial",
  });

  slide.addText(design.subtitle, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 0.6,
    fontSize: 16,
    color: "CCCCCC",
    fontFace: "Arial",
  });

  let yPos = 2.3;
  for (const section of design.sections.slice(0, 5)) {
    slide.addText(section.heading, {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: accent.replace("#", ""),
      fontFace: "Arial",
    });
    yPos += 0.45;

    const body = section.items?.length
      ? section.items.map((i) => `• ${i}`).join("\n")
      : section.body;

    slide.addText(body, {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.8,
      fontSize: 11,
      color: "EEEEEE",
      fontFace: "Arial",
      valign: "top",
    });
    yPos += 0.9;
  }

  if (design.pricing.length > 0) {
    const pricingSlide = pptx.addSlide();
    pricingSlide.background = { color: primary.replace("#", "") };
    pricingSlide.addText("Pricing", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: "FFFFFF",
    });

    design.pricing.forEach((tier, i) => {
      const x = 0.5 + i * 3.1;
      pricingSlide.addText(tier.name, {
        x,
        y: 1.2,
        w: 2.8,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: tier.highlighted ? accent.replace("#", "") : "FFFFFF",
      });
      pricingSlide.addText(`${tier.price}${tier.period ?? ""}`, {
        x,
        y: 1.7,
        w: 2.8,
        h: 0.5,
        fontSize: 20,
        bold: true,
        color: "FFFFFF",
      });
      pricingSlide.addText(tier.features.map((f) => `• ${f}`).join("\n"), {
        x,
        y: 2.3,
        w: 2.8,
        h: 2,
        fontSize: 10,
        color: "CCCCCC",
        valign: "top",
      });
    });
  }

  const ctaSlide = pptx.addSlide();
  ctaSlide.background = { color: accent.replace("#", "") };
  ctaSlide.addText(design.cta, {
    x: 1,
    y: 2.5,
    w: 8,
    h: 1,
    fontSize: 36,
    bold: true,
    color: "FFFFFF",
    align: "center",
  });

  const arrayBuffer = await pptx.write({ outputType: "arraybuffer" });
  return Buffer.from(arrayBuffer as ArrayBuffer);
}
