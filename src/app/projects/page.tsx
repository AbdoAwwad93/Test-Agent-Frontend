"use client";

import { useRouter } from "next/navigation";
import "../../features/projects/projects.css";
import { useProjects } from "@/features/projects/hooks/UseProjects";
import { ProjectsSkeleton } from "@/features/projects/components/ProjectsSkeleton";
import { EmptyProjects } from "@/features/projects/components/EmptyProjects";
import { ProjectsGrid } from "@/features/projects/components/ProjectsGrid";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";

export default function ProjectsPage() {
  const router = useRouter();
  const {
    projects,
    isLoading,
    isError,
    showCreate,
    newName,
    newDesc,
    setNewName,
    setNewDesc,
    openCreateModal,
    closeCreateModal,
    submitCreate,
    isCreating,
    createError,
  } = useProjects();

  return (
    <div className="page active">
      <header className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            Group your test runs into projects for better organization.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openCreateModal}>
            <span className="material-icons-round">add</span>
            New Project
          </button>
        </div>
      </header>

      {isLoading ? (
        <ProjectsSkeleton />
      ) : isError ? (
        <div className="empty-state">
          <p>Could not load projects. Please try again.</p>
        </div>
      ) : projects.length === 0 ? (
        <EmptyProjects onCreateClick={openCreateModal} />
      ) : (
        <ProjectsGrid
          projects={projects}
          onProjectClick={(projectId) => router.push(`/projects/${projectId}`)}
          onCreateClick={openCreateModal}
        />
      )}

      {showCreate && (
        <CreateProjectModal
          newName={newName}
          newDesc={newDesc}
          setNewName={setNewName}
          setNewDesc={setNewDesc}
          onClose={closeCreateModal}
          onSubmit={submitCreate}
          isCreating={isCreating}
          createError={createError}
        />
      )}
    </div>
  );
}