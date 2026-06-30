import DOMPurify from "isomorphic-dompurify";

const ALLOWED_SVG_TAGS = [
  "svg",
  "g",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "defs",
  "linearGradient",
  "radialGradient",
  "stop",
  "clipPath",
  "use",
  "title",
  "desc",
];

const ALLOWED_ATTR = [
  "viewBox",
  "width",
  "height",
  "xmlns",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "d",
  "x",
  "y",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x1",
  "y1",
  "x2",
  "y2",
  "points",
  "transform",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "text-anchor",
  "id",
  "class",
  "offset",
  "stop-color",
  "gradientUnits",
  "gradientTransform",
  "clip-path",
  "href",
  "xlink:href",
];

export function sanitizeSvg(svg: string): string {
  const cleaned = DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ALLOWED_TAGS: ALLOWED_SVG_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTR,
    FORBID_TAGS: ["script", "foreignObject", "iframe", "object", "embed"],
    FORBID_ATTR: ["onload", "onclick", "onerror", "onmouseover"],
  });

  if (!cleaned.includes("<svg")) {
    throw new Error("Invalid SVG: missing root element");
  }

  return cleaned;
}

export function validateSvg(svg: string): { valid: boolean; error?: string } {
  try {
    sanitizeSvg(svg);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "SVG validation failed",
    };
  }
}
