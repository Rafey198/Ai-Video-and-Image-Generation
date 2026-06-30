"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Copy, Eye, EyeOff, Key, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string | null;
};

const MOCK_KEYS: ApiKey[] = [
  {
    id: "1",
    name: "Production",
    prefix: "vm_live_••••••••",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_KEYS);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function createKey() {
    if (!newKeyName.trim()) return;
    const key: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName,
      prefix: `vm_live_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
    };
    setKeys((k) => [key, ...k]);
    setNewKeyName("");
    setDialogOpen(false);
    toast({ title: "API key created", description: "Copy it now — you won't see it again." });
  }

  function revokeKey(id: string) {
    setKeys((k) => k.filter((key) => key.id !== id));
    toast({ title: "API key revoked" });
  }

  function copyPrefix(prefix: string) {
    navigator.clipboard.writeText(prefix);
    toast({ title: "Copied to clipboard" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage programmatic access to VireoMorph</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-aurora shadow-neon-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create key
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border/60 bg-card">
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>Give your key a descriptive name</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="key-name">Key name</Label>
              <Input
                id="key-name"
                placeholder="e.g. Production server"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="border-border/60 bg-background/50"
              />
            </div>
            <DialogFooter>
              <Button onClick={createKey}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-violet-electric" />
            Your API keys
          </CardTitle>
          <CardDescription>Keep your keys secret. Never share them publicly.</CardDescription>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No API keys yet</p>
          ) : (
            <div className="divide-y divide-border/40">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{key.name}</p>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <p className="mt-1 font-mono text-sm text-muted-foreground">
                      {revealed === key.id ? key.prefix.replace("••••", "abcd1234") : key.prefix}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                      {key.lastUsedAt &&
                        ` · Last used ${formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })}`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setRevealed(revealed === key.id ? null : key.id)}
                    >
                      {revealed === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => copyPrefix(key.prefix)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => revokeKey(key.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
