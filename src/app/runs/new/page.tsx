"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCreateRun } from "@/features/runs/hooks/UseCreateRun";
import { fetchProjects, type ProjectRecord } from "@/lib/api";

type TargetEntry = { url: string; role: string };

export default function NewRun() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProjectId = searchParams.get("project_id") || "";

  const [multiRole, setMultiRole] = useState(false);
  const [url, setUrl] = useState("");
  const [targets, setTargets] = useState<TargetEntry[]>([
    { url: "", role: "" },
  ]);
  const [story, setStory] = useState("");
  const [headless, setHeadless] = useState(true);
  const [projectId, setProjectId] = useState(preselectedProjectId);
  const [urlError, setUrlError] = useState("");
  const [storyError, setStoryError] = useState("");

  const { mutate: submitRun, isPending, error } = useCreateRun();

  const { data: projects = [] } = useQuery<ProjectRecord[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const handleSubmit = () => {
    let nextUrlError = "";
    if (multiRole) {
      const emptyTarget = targets.some((t) => !t.url);
      nextUrlError = emptyTarget ? "All target URLs are required." : "";
    } else {
      nextUrlError = !url ? "Please provide a target URL." : "";
    }
    const nextStoryError = !story ? "Please describe a user story." : "";

    setUrlError(nextUrlError);
    setStoryError(nextStoryError);

    if (nextUrlError || nextStoryError) {
      return;
    }

    const basePayload = multiRole
      ? {
          targets: targets.map((t) => ({
            url: t.url,
            role: t.role || null,
          })),
          story,
          headless,
        }
      : { url, story, headless };

    const payload = {
      ...basePayload,
      ...(projectId ? { project_id: projectId } : {}),
    };

    submitRun(payload, {
      onSuccess: (data) => {
        router.push(`/runs/${data.run_id}`);
      },
    });
  };

  const addTarget = () => {
    setTargets([...targets, { url: "", role: "" }]);
  };

  const removeTarget = (idx: number) => {
    if (targets.length <= 1) return;
    setTargets(targets.filter((_, i) => i !== idx));
  };

  const updateTarget = (idx: number, field: "url" | "role", value: string) => {
    const next = targets.map((t, i) => (i === idx ? { ...t, [field]: value } : t));
    setTargets(next);
    if (urlError) setUrlError("");
  };

  const submitError =
    error instanceof Error
      ? error.message
      : error
      ? "An unknown error occurred"
      : "";

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
          <div className="form-group">
            <label className="form-label">
              <span className="material-icons-round">folder</span>
              Project (optional)
            </label>
            <p className="form-hint">
              Associate this run with a project to keep related runs organized.
            </p>
            <select
              className="form-input"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">-- No project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div className="toggle-row">
              <div>
                <span className="toggle-label">Multi-Role Mode</span>
                <span className="toggle-sub">
                  Test a story across multiple roles and URLs
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={multiRole}
                  onChange={(e) => {
                    setMultiRole(e.target.checked);
                    if (urlError) setUrlError("");
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {multiRole ? (
            <div className="form-group">
              <label className="form-label">
                <span className="material-icons-round">link</span>
                Targets
              </label>
              <p className="form-hint">
                Add one target per role. The agent will process them in order.
              </p>
              {targets.map((t, idx) => (
                <div key={idx} className="target-row" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="url"
                      className={`form-input${urlError ? " form-input-error" : ""}`}
                      placeholder="https://example.com"
                      value={t.url}
                      onChange={(e) => updateTarget(idx, "url", e.target.value)}
                      aria-invalid={Boolean(urlError)}
                    />
                  </div>
                  <div style={{ width: '140px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="role (e.g. customer)"
                      value={t.role}
                      onChange={(e) => updateTarget(idx, "role", e.target.value)}
                    />
                  </div>
                  {targets.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => removeTarget(idx)}
                      style={{ padding: '0.5rem' }}
                      title="Remove target"
                    >
                      <span className="material-icons-round" style={{ fontSize: '1.2rem' }}>close</span>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={addTarget}
                style={{ marginTop: '0.25rem' }}
              >
                <span className="material-icons-round" style={{ fontSize: '1rem' }}>add</span>
                Add Target
              </button>
              {urlError && (
                <span className="field-error">
                  <span className="material-icons-round">error_outline</span>
                  {urlError}
                </span>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label" htmlFor="input-url">
                <span className="material-icons-round">link</span>
                Target URL
              </label>
              <p className="form-hint">
                Provide the initial URL where the agent will begin its journey.
              </p>
              <input
                type="url"
                id="input-url"
                className={`form-input${urlError ? " form-input-error" : ""}`}
                placeholder="https://example.com"
                autoComplete="off"
                spellCheck="false"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError("");
                }}
                aria-invalid={Boolean(urlError)}
                aria-describedby={urlError ? "input-url-error" : undefined}
              />
              {urlError && (
                <span className="field-error" id="input-url-error">
                  <span className="material-icons-round">error_outline</span>
                  {urlError}
                </span>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="input-story">
              <span className="material-icons-round">auto_stories</span>
              User Story
            </label>
            <p className="form-hint">
              Describe the user journey in natural language. The agent will
              interpret these instructions.
            </p>
            <textarea
              id="input-story"
              className={`form-textarea${
                storyError ? " form-input-error" : ""
              }`}
              placeholder="User tries to log in with valid credentials, navigates to the dashboard, and verifies their profile information is displayed correctly..."
              rows={6}
              value={story}
              onChange={(e) => {
                setStory(e.target.value);
                if (storyError) setStoryError("");
              }}
              aria-invalid={Boolean(storyError)}
              aria-describedby={storyError ? "input-story-error" : undefined}
            ></textarea>
            {storyError && (
              <span className="field-error" id="input-story-error">
                <span className="material-icons-round">error_outline</span>
                {storyError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="material-icons-round">tune</span>
              Execution Parameters
            </label>
            <div className="toggle-row">
              <div>
                <span className="toggle-label">Headless Browser</span>
                <span className="toggle-sub">
                  Run without visible browser window
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={headless}
                  onChange={(e) => setHeadless(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="form-quote">
            <span className="material-icons-round">format_quote</span>
            &ldquo;Ensure narratives are precise. Ambiguity leads to divergent
            exploration states.&rdquo;
          </div>

          <div className="form-actions">
            <button
              className="btn btn-ghost"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-large"
              onClick={handleSubmit}
              disabled={isPending}
            >
              <span className="material-icons-round">
                {isPending ? "hourglass_empty" : "play_arrow"}
              </span>
              {isPending ? "Initiating..." : "Initiate Sequence"}
            </button>
          </div>

          {submitError && (
            <div className="form-error">
              <span className="material-icons-round">error_outline</span>
              <span>{submitError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
