"use client";

import { ExecutionParams } from "@/features/runs/components/ExecutionParams";
import { MultiRoleToggle } from "@/features/runs/components/MultiRoleToggle";
import { MultiTargetInputs } from "@/features/runs/components/MutliTargetInputs";
import { NewRunFormActions } from "@/features/runs/components/NewRunFormAActions";
import { NewRunPreview } from "@/features/runs/components/NewRunPreview";
import { ProjectSelector } from "@/features/runs/components/ProjectSelector";
import { TargetUrlInput } from "@/features/runs/components/TargetUrlInput";
import { UserStoryInput } from "@/features/runs/components/UserStoryInput";
import { useNewRun } from "@/features/runs/hooks/UseNewRun";
import "../../../features/runs/runs.css"
export default function NewRun() {
  const {
    projects,
    projectId,
    setProjectId,
    multiRole,
    toggleMultiRole,
    url,
    updateUrl,
    targets,
    addTarget,
    removeTarget,
    updateTarget,
    story,
    updateStory,
    headless,
    setHeadless,
    urlError,
    storyError,
     urlSuggestions,
    handleSubmit,
    isPending,
    submitError,
    cancel,
  } = useNewRun();

  const selectedProjectName =
    projects.find((p) => p.id === projectId)?.name ?? null;

  return (
    <div className="page active">
      <header className="page-header">
        <div>
          <h1 className="page-title">Design New Narrative</h1>
          <p className="page-subtitle">
            Establish the parameters and starting point for your automated
            testing narrative.
          </p>
        </div>
      </header>

      <div className="new-run-layout">
        <div className="new-run-main">
          <div className="form-card">
            <div className="form-section">
              <span className="section-step">01 — SCOPE</span>
              <ProjectSelector
                projects={projects}
                projectId={projectId}
                setProjectId={setProjectId}
              />
              <MultiRoleToggle
                multiRole={multiRole}
                toggleMultiRole={toggleMultiRole}
              />
              {multiRole ? (
                <MultiTargetInputs
                  targets={targets}
                  addTarget={addTarget}
                  removeTarget={removeTarget}
                  updateTarget={updateTarget}
                  urlError={urlError}
                />
              ) : (
                <TargetUrlInput
                  url={url}
                  updateUrl={updateUrl}
                  urlError={urlError}
                  suggestions={urlSuggestions}
                />
              )}
            </div>

            <div className="form-section">
              <span className="section-step">02 — NARRATIVE</span>
              <UserStoryInput
                story={story}
                updateStory={updateStory}
                storyError={storyError}
              />
            </div>

            <div className="form-section">
              <span className="section-step">03 — EXECUTION</span>
              <ExecutionParams
                headless={headless}
                setHeadless={setHeadless}
              />
            </div>

            <NewRunFormActions
              cancel={cancel}
              handleSubmit={handleSubmit}
              isPending={isPending}
              submitError={submitError}
            />
          </div>
        </div>

        <NewRunPreview
          projectName={selectedProjectName}
          multiRole={multiRole}
          url={url}
          targetsCount={targets.length}
          story={story}
          headless={headless}
        />
      </div>
    </div>
  );
}