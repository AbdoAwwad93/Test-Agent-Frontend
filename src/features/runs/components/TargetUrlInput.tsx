"use client";

import { type UrlSuggestion } from "@/features/runs/hooks/UseNewRun";

interface TargetUrlInputProps {
  url: string;
  updateUrl: (value: string) => void;
  urlError: string;
  suggestions?: UrlSuggestion[];
}

export function TargetUrlInput({
  url,
  updateUrl,
  urlError,
  suggestions = [],
}: TargetUrlInputProps) {
  return (
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
        onChange={(e) => updateUrl(e.target.value)}
        aria-invalid={Boolean(urlError)}
        aria-describedby={urlError ? "input-url-error" : undefined}
      />

      {suggestions.length > 0 && (
        <div className="url-suggestions">
          <span className="url-suggestions-label">
            {suggestions[0].related ? "Recent for this project" : "Recently used"}
          </span>
          {suggestions.map((s) => (
            <button
              type="button"
              key={s.url}
              className={`url-chip${s.related ? " related" : ""}${
                url === s.url ? " active" : ""
              }`}
              onClick={() => updateUrl(s.url)}
              title={s.url}
            >
              {s.related && (
                <span className="material-icons-round">bookmark</span>
              )}
              <span className="url-chip-text">{s.url}</span>
            </button>
          ))}
        </div>
      )}

      {urlError && (
        <span className="field-error" id="input-url-error">
          <span className="material-icons-round">error_outline</span>
          {urlError}
        </span>
      )}
    </div>
  );
}