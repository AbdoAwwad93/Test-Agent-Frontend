"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import "../../../features/projects/projects.css"
import { useProjectDetail } from "@/features/projects/hooks/UseProjectDetail";
import { ProjectDetailSkeleton } from "@/features/projects/components/Project-Details/ProjectDrailsSkeleton";
import { ProjectNotFound } from "@/features/projects/components/Project-Details/ProjectNotFound";
import { ProjectDetailHeader } from "@/features/projects/components/Project-Details/ProjectDetailHeader";
import { ProjectRunsList } from "@/features/projects/components/Project-Details/ProjectRunsList";
import { ProjectStatsGrid } from "@/features/projects/components/Project-Details/ProjectStatsGrid";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    project,
    runs,
    runStats,
    isProjectLoading,
    isProjectError,
    isRunsLoading,
  } = useProjectDetail(id);

  const goBack = useCallback(() => router.push("/projects"), [router]);
  const goNewRun = useCallback(
    () => router.push(`/runs/new?project_id=${id}`),
    [router, id]
  );
  const goToRun = useCallback(
    (runId: string) => router.push(`/runs/${runId}`),
    [router]
  );

  if (isProjectLoading) return <ProjectDetailSkeleton />;
  if (isProjectError || !project) return <ProjectNotFound />;

  return (
    <div className="page active">
      <ProjectDetailHeader
        project={project}
        onBack={goBack}
        onNewRun={goNewRun}
      />
      <ProjectStatsGrid stats={runStats} />
      <ProjectRunsList
        runs={runs}
        isLoading={isRunsLoading}
        onRunClick={goToRun}
      />
    </div>
  );
}