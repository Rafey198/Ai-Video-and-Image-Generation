import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FolderKanban, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function ProjectsPage() {
  const session = await getSession();
  if (!session) return null;

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { generationJobs: true, assets: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Organize generations into creative projects</p>
        </div>
        <Button className="bg-aurora shadow-neon-sm">
          <Plus className="mr-2 h-4 w-4" />
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-card/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="font-medium">No projects yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a project to group related generations and assets
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="border-border/60 bg-card/50 transition-colors hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project._count.generationJobs} jobs</span>
                  <span>{project._count.assets} assets</span>
                  <span>{formatDistanceToNow(project.updatedAt, { addSuffix: true })}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
