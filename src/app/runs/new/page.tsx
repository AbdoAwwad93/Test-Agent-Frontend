"use client";

import { ExecutionParams } from "@/features/runs/components/ExecutionParams";
import { MultiRoleToggle } from "@/features/runs/components/MultiRoleToggle";
import { MultiTargetInputs } from "@/features/runs/components/MutliTargetInputs";
import { NewRunFormActions } from "@/features/runs/components/NewRunFormAActions";
import { ProjectSelector } from "@/features/runs/components/ProjectSelector";
import { TargetUrlInput } from "@/features/runs/components/TargetUrlInput";
import { UserStoryInput } from "@/features/runs/components/UserStoryInput";
import { useNewRun } from "@/features/runs/hooks/UseNewRun";



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
    handleSubmit,
    isPending,
    submitError,
    cancel,
  } = useNewRun();

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

      <div className="form-container">
        <div className="form-card">
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
            />
          )}

          <UserStoryInput
            story={story}
            updateStory={updateStory}
            storyError={storyError}
          />

          <ExecutionParams headless={headless} setHeadless={setHeadless} />

          <div className="form-quote">
            <span className="material-icons-round">format_quote</span>
            &ldquo;Ensure narratives are precise. Ambiguity leads to divergent
            exploration states.&rdquo;
          </div>

          <NewRunFormActions
            cancel={cancel}
            handleSubmit={handleSubmit}
            isPending={isPending}
            submitError={submitError}
          />
        </div>
      </div>
    </div>
  );
}