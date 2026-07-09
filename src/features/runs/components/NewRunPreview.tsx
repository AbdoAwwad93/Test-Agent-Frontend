"use client";

import "../runs.css";
interface NewRunPreviewProps {
  projectName: string | null;
  multiRole: boolean;
  url: string;
  targetsCount: number;
  story: string;
  headless: boolean;
}

export function NewRunPreview({
  projectName,
  multiRole,
  url,
  targetsCount,
  story,
  headless,
}: NewRunPreviewProps) {
  const storyPreview =
    story.trim().length > 0
      ? story.length > 140
        ? story.slice(0, 140).trim() + "…"
        : story
      : null;

  return (
    <div className="new-run-preview">
      <div className="preview-card">
        <div className="preview-title">Narrative Preview</div>

        <div className="preview-row">
          <span className="material-icons-round">folder</span>
          <div className="preview-row-content">
            <div className="preview-label">Project</div>
            <div className={`preview-value${projectName ? "" : " empty"}`}>
              {projectName ?? "No project selected"}
            </div>
          </div>
        </div>

        <div className="preview-row">
          <span className="material-icons-round">link</span>
          <div className="preview-row-content">
            <div className="preview-label">
              {multiRole ? `Targets (${targetsCount})` : "Target URL"}
            </div>
            <div className={`preview-value${url || multiRole ? "" : " empty"}`}>
              {multiRole
                ? `${targetsCount} target${targetsCount === 1 ? "" : "s"} configured`
                : url || "Not set"}
            </div>
          </div>
        </div>

        <div className="preview-row">
          <span className="material-icons-round">auto_stories</span>
          <div className="preview-row-content">
            <div className="preview-label">User Story</div>
            <div className={`preview-value${storyPreview ? "" : " empty"}`}>
              {storyPreview ?? "Not written yet"}
            </div>
          </div>
        </div>

        <div className="preview-row">
          <span className="material-icons-round">visibility_off</span>
          <div className="preview-row-content">
            <div className="preview-label">Browser Mode</div>
            <div className="preview-value">
              {headless ? "Headless" : "Visible window"}
            </div>
          </div>
        </div>
      </div>

      <div className="preview-quote">
        &ldquo;Ensure narratives are precise. Ambiguity leads to divergent
        exploration states.&rdquo;
      </div>
    </div>
  );
}