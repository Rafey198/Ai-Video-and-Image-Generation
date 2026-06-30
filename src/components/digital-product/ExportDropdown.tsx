"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { ExportFormat } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseApiJson } from "@/lib/utils/parse-api-json";
import { toast } from "@/components/ui/toast";

const FORMATS: { format: ExportFormat; label: string }[] = [
  { format: "pdf", label: "PDF" },
  { format: "png", label: "PNG" },
  { format: "jpg", label: "JPG" },
  { format: "pptx", label: "PPTX (Canva)" },
  { format: "svg", label: "SVG" },
  { format: "xlsx", label: "XLSX" },
  { format: "docx", label: "DOCX" },
  { format: "json", label: "JSON" },
  { format: "zip", label: "ZIP Bundle" },
];

type ExportDropdownProps = {
  productId: string;
};

export function ExportDropdown({ productId }: ExportDropdownProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  async function handleExport(format: ExportFormat) {
    setExporting(format);
    try {
      const res = await fetch("/api/digital-product/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, format }),
      });
      const data = await parseApiJson<{ downloadUrl: string; error?: string }>(res);
      if (!res.ok) throw new Error(data.error);

      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = `template.${format}`;
      link.click();

      toast({ title: "Export ready", description: `Downloaded as ${format.toUpperCase()}.` });
    } catch (err) {
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "Failed",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {FORMATS.map(({ format, label }) => (
          <DropdownMenuItem
            key={format}
            disabled={exporting !== null}
            onClick={() => handleExport(format)}
          >
            {exporting === format ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
