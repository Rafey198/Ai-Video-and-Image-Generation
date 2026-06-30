"use client";

import { useEffect, useState } from "react";
import { Download, Heart, Search, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportDropdown } from "@/components/digital-product/ExportDropdown";

type DashboardProduct = {
  id: string;
  title: string;
  type: string;
  category: string;
  status: string;
  favorite: boolean;
  createdAt: string;
  exports: { format: string; fileUrl: string; createdAt: string }[];
};

type DashboardExport = {
  id: string;
  format: string;
  fileUrl: string;
  createdAt: string;
  product: { title: string; type: string };
};

export default function DigitalProductDashboardPage() {
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [exports, setExports] = useState<DashboardExport[]>([]);
  const [stats, setStats] = useState<{ type: string; _count: number }[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/digital-product/dashboard?${params}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setExports(data.exports ?? []);
    setStats(data.stats ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function toggleFavorite(id: string, favorite: boolean) {
    await fetch("/api/digital-product/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, favorite: !favorite }),
    });
    loadDashboard();
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/digital-product/dashboard?id=${id}`, { method: "DELETE" });
    loadDashboard();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Digital Product Dashboard</h1>
        <p className="text-muted-foreground">Your generated templates, exports, and favorites.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.type} className="border-border/60 bg-card/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{s._count}</div>
              <p className="text-sm text-muted-foreground capitalize">{s.type.replace(/_/g, " ")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && loadDashboard()}
          />
        </div>
        <Button variant="outline" onClick={loadDashboard}>Search</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : products.length === 0 ? (
            <Card className="border-dashed border-border/60 p-8 text-center">
              <p className="text-muted-foreground">No templates yet.</p>
              <Button className="mt-4" asChild>
                <Link href="/digital-product">Create your first template</Link>
              </Button>
            </Card>
          ) : (
            products.map((p) => (
              <Card key={p.id} className="border-border/60 bg-card/50">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="font-medium">{p.title}</h3>
                    <div className="mt-1 flex gap-2">
                      <Badge variant="outline" className="text-xs capitalize">{p.type.replace(/_/g, " ")}</Badge>
                      <Badge variant="outline" className="text-xs">{p.status}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => toggleFavorite(p.id, p.favorite)}>
                      <Heart className={`h-4 w-4 ${p.favorite ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <ExportDropdown productId={p.id} />
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={`/digital-product/editor/${p.id}`}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteProduct(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-4 space-y-3">
          {products.filter((p) => p.favorite).map((p) => (
            <Card key={p.id} className="border-border/60 bg-card/50">
              <CardContent className="py-4">
                <h3 className="font-medium">{p.title}</h3>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="exports" className="mt-4 space-y-3">
          {exports.map((e) => (
            <Card key={e.id} className="border-border/60 bg-card/50">
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium">{e.product.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {e.format.toUpperCase()} — {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href={e.fileUrl} download>Download</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
