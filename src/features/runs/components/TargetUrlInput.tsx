"use client";

interface TargetUrlInputProps {
  url: string;
  updateUrl: (value: string) => void;
  urlError: string;
}

export function TargetUrlInput({
  url,
  updateUrl,
  urlError,
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
      {urlError && (
        <span className="field-error" id="input-url-error">
          <span className="material-icons-round">error_outline</span>
          {urlError}
        </span>
      )}
    </div>
  );
}