"use client";

import { useState } from "react";
import { Crown, Mail, Plus, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";

const MOCK_MEMBERS = [
  { id: "1", name: "You", email: "owner@example.com", role: "owner" },
  { id: "2", name: "Alex Chen", email: "alex@studio.com", role: "editor" },
  { id: "3", name: "Sam Rivera", email: "sam@studio.com", role: "viewer" },
];

const ROLE_COLORS: Record<string, string> = {
  owner: "bg-violet-glow/20 text-violet-electric",
  editor: "bg-cyan-aurora/20 text-cyan-aurora",
  viewer: "bg-muted text-muted-foreground",
};

export default function TeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team & Workspace</h1>
          <p className="text-muted-foreground">Collaborate with your team on shared projects</p>
        </div>
        <Button className="bg-aurora shadow-neon-sm">
          <Plus className="mr-2 h-4 w-4" />
          New workspace
        </Button>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Workspace members
          </CardTitle>
          <CardDescription>3 members · Personal workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="colleague@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="border-border/60 bg-background/50"
            />
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>

          <div className="divide-y divide-border/40">
            {MOCK_MEMBERS.map((member) => (
              <div key={member.id} className="flex items-center gap-4 py-3">
                <Avatar>
                  <AvatarFallback className="bg-aurora">{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.name}</p>
                    {member.role === "owner" && <Crown className="h-3 w-3 text-amber-400" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <Badge className={ROLE_COLORS[member.role] ?? ""}>{member.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
