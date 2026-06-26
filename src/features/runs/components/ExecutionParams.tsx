"use client";

interface ExecutionParamsProps {
  headless: boolean;
  setHeadless: (checked: boolean) => void;
}

export function ExecutionParams({
  headless,
  setHeadless,
}: ExecutionParamsProps) {
  return (
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
  );
}