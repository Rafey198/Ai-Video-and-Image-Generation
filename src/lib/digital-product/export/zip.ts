import JSZip from "jszip";

import type { TemplateDesignJson } from "../types";
import { designToHtml } from "./pdf";
import { designToPptx } from "./pptx";
import { buildWorkbookBuffer } from "../spreadsheet/builder";
import { sanitizeSvg } from "../security/svg-sanitize";

export type ZipBundleInput = {
  design: TemplateDesignJson;
  svgContent?: string;
  spreadsheetType?: string;
  watermark?: boolean;
};

export async function createDigitalProductZip(input: ZipBundleInput): Promise<Buffer> {
  const zip = new JSZip();
  const { design, watermark = false } = input;

  const html = designToHtml(design, watermark);
  zip.folder("PDF")?.file(`${slugify(design.title)}.html`, html);

  const pptx = await designToPptx(design);
  zip.folder("PPTX")?.file(`${slugify(design.title)}.pptx`, pptx);

  zip.folder("PNG");
  zip.folder("JSON")?.file(`${slugify(design.title)}.json`, JSON.stringify(design, null, 2));

  if (input.svgContent) {
    const safeSvg = sanitizeSvg(input.svgContent);
    zip.folder("SVG")?.file("logo.svg", safeSvg);
    zip.folder("BrandKit")?.file("logo.svg", safeSvg);
    zip.folder("BrandKit")?.file("brand-guide.json", JSON.stringify({
      title: design.title,
      colorPalette: design.colorPalette,
      brandStyle: design.brandStyle,
      visualDirection: design.visualDirection,
    }, null, 2));
  }

  if (input.spreadsheetType) {
    const xlsx = await buildWorkbookBuffer(input.spreadsheetType, { sampleData: true, includeFormulas: true });
    zip.folder("Excel")?.file(`${input.spreadsheetType}.xlsx`, xlsx);
  }

  zip.folder("Instructions")?.file("README.txt", `Digital Product Pack: ${design.title}

Contents:
- /PDF - Print-ready HTML (convert via export worker)
- /PPTX - Editable PowerPoint for Canva import
- /JSON - Source template data
- /SVG - Vector logo files
- /Excel - Spreadsheet templates
- /BrandKit - Branding assets

${watermark ? "Note: Free plan exports include watermark." : ""}
`);

  zip.folder("PreviewImages");
  zip.file("README.pdf.txt", `See /Instructions/README.txt for bundle contents.`);

  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "template";
}
