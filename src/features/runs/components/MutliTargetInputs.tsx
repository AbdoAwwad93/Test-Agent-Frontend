"use client";

import { type TargetEntry } from "@/features/runs/hooks/UseNewRun";

interface MultiTargetInputsProps {
  targets: TargetEntry[];
  addTarget: () => void;
  removeTarget: (idx: number) => void;
  updateTarget: (idx: number, field: "url" | "role", value: string) => void;
  urlError: string;
}

export function MultiTargetInputs({
  targets,
  addTarget,
  removeTarget,
  updateTarget,
  urlError,
}: MultiTargetInputsProps) {
  return (
    <div className="form-group">
      <label className="form-label">
        <span className="material-icons-round">link</span>
        Targets
      </label>
      <p className="form-hint">
        Add one target per role. The agent will process them in order.
      </p>
      {targets.map((t, idx) => (
        <div
          key={idx}
          className="target-row"
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            alignItems: "flex-start",
          }}
        >
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
          <div style={{ width: "140px" }}>
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
              style={{ padding: "0.5rem" }}
              title="Remove target"
            >
              <span
                className="material-icons-round"
                style={{ fontSize: "1.2rem" }}
              >
                close
              </span>
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="btn btn-ghost"
        onClick={addTarget}
        style={{ marginTop: "0.25rem" }}
      >
        <span className="material-icons-round" style={{ fontSize: "1rem" }}>
          add
        </span>
        Add Target
      </button>
      {urlError && (
        <span className="field-error">
          <span className="material-icons-round">error_outline</span>
          {urlError}
        </span>
      )}
    </div>
  );
}