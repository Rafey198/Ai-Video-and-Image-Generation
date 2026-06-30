import type { ExportFormat } from "@prisma/client";
import sharp from "sharp";

import type { TemplateDesignJson } from "../types";
import { designToHtml, htmlToPdfBuffer, htmlToPngBuffer } from "./pdf";
import { designToPptx } from "./pptx";
import { createDigitalProductZip } from "./zip";
import { buildWorkbookBuffer } from "../spreadsheet/builder";
import { sanitizeSvg } from "../security/svg-sanitize";

export type ExportInput = {
  format: ExportFormat;
  design: TemplateDesignJson;
  watermark?: boolean;
  svgContent?: string;
  spreadsheetType?: string;
};

export type ExportResult = {
  buffer: Buffer;
  contentType: string;
  extension: string;
};

export async function exportDigitalProduct(input: ExportInput): Promise<ExportResult> {
  const { format, design, watermark = false } = input;

  switch (format) {
    case "json":
      return {
        buffer: Buffer.from(JSON.stringify(design, null, 2)),
        contentType: "application/json",
        extension: "json",
      };

    case "pptx": {
      const buffer = await designToPptx(design);
      return { buffer, contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", extension: "pptx" };
    }

    case "pdf": {
      const html = designToHtml(design, watermark);
      const buffer = await htmlToPdfBuffer(html);
      return { buffer, contentType: "application/pdf", extension: "pdf" };
    }

    case "png": {
      const html = designToHtml(design, watermark);
      let buffer = await htmlToPngBuffer(html);
      if (!buffer.slice(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) {
        buffer = await sharp({
          create: { width: 1080, height: 1350, channels: 3, background: design.colorPalette[0] ?? "#0F172A" },
        })
          .png()
          .toBuffer();
      }
      return { buffer, contentType: "image/png", extension: "png" };
    }

    case "jpg": {
      const buffer = await sharp({
        create: { width: 1080, height: 1350, channels: 3, background: design.colorPalette[0] ?? "#0F172A" },
      })
        .jpeg({ quality: 90 })
        .toBuffer();
      return { buffer, contentType: "image/jpeg", extension: "jpg" };
    }

    case "svg": {
      const svg = input.svgContent ?? generatePlaceholderSvg(design);
      const safe = sanitizeSvg(svg);
      return { buffer: Buffer.from(safe), contentType: "image/svg+xml", extension: "svg" };
    }

    case "xlsx": {
      const templateType = input.spreadsheetType ?? "ultimate_project_manager";
      const buffer = await buildWorkbookBuffer(templateType, { sampleData: true, includeFormulas: true });
      return {
        buffer,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "xlsx",
      };
    }

    case "zip": {
      const buffer = await createDigitalProductZip({
        design,
        svgContent: input.svgContent,
        spreadsheetType: input.spreadsheetType,
        watermark,
      });
      return { buffer, contentType: "application/zip", extension: "zip" };
    }

    case "docx": {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({ text: design.title, heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: design.subtitle }),
            ...design.sections.flatMap((s) => [
              new Paragraph({ text: s.heading, heading: HeadingLevel.HEADING_2 }),
              new Paragraph({ children: [new TextRun(s.body)] }),
            ]),
          ],
        }],
      });
      const buffer = await Packer.toBuffer(doc);
      return {
        buffer: Buffer.from(buffer),
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: "docx",
      };
    }

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

function generatePlaceholderSvg(design: TemplateDesignJson): string {
  const primary = design.colorPalette[0] ?? "#3B82F6";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
    <rect width="400" height="120" fill="${primary}" opacity="0.1"/>
    <text x="20" y="70" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="${primary}">${design.title}</text>
  </svg>`;
}
