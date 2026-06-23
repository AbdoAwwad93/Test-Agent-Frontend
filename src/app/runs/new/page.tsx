"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateRun } from "@/features/runs/hooks/UseCreateRun";

export default function NewRun() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [story, setStory] = useState("");
  const [headless, setHeadless] = useState(true);
  const [urlError, setUrlError] = useState("");
  const [storyError, setStoryError] = useState("");

  const { mutate: submitRun, isPending, error } = useCreateRun();

  const handleSubmit = () => {
    const nextUrlError = !url ? "Please provide a target URL." : "";
    const nextStoryError = !story ? "Please describe a user story." : "";

    setUrlError(nextUrlError);
    setStoryError(nextStoryError);

    if (nextUrlError || nextStoryError) {
      return;
    }

    submitRun(
      { url, story, headless },
      {
        onSuccess: (data) => router.push(`/runs/${data.run_id}`),
      }
    );
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