/**
 * Export Worker Service for VireoMorph Digital Product Studio
 *
 * Deploy separately from the Next.js app (e.g. Railway, Fly.io, or Docker).
 * Handles PDF/PNG generation via Puppeteer for Vercel-compatible architecture.
 *
 * Usage:
 *   npm install
 *   npm start
 *
 * Set EXPORT_WORKER_URL=http://localhost:3100 in the main app .env
 */

import http from "http";

const PORT = Number(process.env.PORT ?? 3100);

type ExportRequest = {
  html: string;
  width?: number;
  height?: number;
};

async function generatePdf(html: string): Promise<Buffer> {
  try {
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });
    await browser.close();
    return Buffer.from(pdf);
  } catch (error) {
    console.warn("Puppeteer unavailable, returning HTML fallback:", error);
    return Buffer.from(html, "utf-8");
  }
}

async function generatePng(html: string, width = 1080, height = 1350): Promise<Buffer> {
  try {
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setContent(html, { waitUntil: "networkidle0" });
    const screenshot = await page.screenshot({ type: "png", fullPage: true });
    await browser.close();
    return Buffer.from(screenshot);
  } catch (error) {
    console.warn("Puppeteer unavailable for PNG:", error);
    return Buffer.from(html, "utf-8");
  }
}

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "export-worker" }));
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  const authHeader = req.headers.authorization;
  const apiKey = process.env.WORKER_API_KEY;
  if (apiKey && authHeader !== `Bearer ${apiKey}`) {
    res.writeHead(401);
    res.end("Unauthorized");
    return;
  }

  try {
    const body = JSON.parse(await readBody(req)) as ExportRequest;
    const url = req.url ?? "";

    if (url === "/export/pdf") {
      const pdf = await generatePdf(body.html);
      res.writeHead(200, { "Content-Type": "application/pdf" });
      res.end(pdf);
    } else if (url === "/export/png") {
      const png = await generatePng(body.html, body.width, body.height);
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(png);
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  } catch (error) {
    console.error("Export error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Export failed" }));
  }
});

server.listen(PORT, () => {
  console.log(`Export worker listening on port ${PORT}`);
});
