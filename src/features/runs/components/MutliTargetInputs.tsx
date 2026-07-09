"use client";

import { type TargetEntry } from "@/features/runs/hooks/UseNewRun";
import "../runs.css";
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
        <div key={idx} className="target-row">
          <input
            type="url"
            className={`form-input target-url${
              urlError ? " form-input-error" : ""
            }`}
            placeholder="https://example.com"
            value={t.url}
            onChange={(e) => updateTarget(idx, "url", e.target.value)}
            aria-invalid={Boolean(urlError)}
          />
          <input
            type="text"
            className="form-input target-role"
            placeholder="role (e.g. customer)"
            value={t.role}
            onChange={(e) => updateTarget(idx, "role", e.target.value)}
          />
          {targets.length > 1 && (
            <button
              type="button"
              className="btn btn-ghost target-remove-btn"
              onClick={() => removeTarget(idx)}
              title="Remove target"
            >
              <span className="material-icons-round">close</span>
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn btn-ghost add-target-btn"
        onClick={addTarget}
      >
        <span className="material-icons-round">add</span>
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