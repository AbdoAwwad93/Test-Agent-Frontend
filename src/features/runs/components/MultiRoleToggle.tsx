"use client";

import "../runs.css";
interface MultiRoleToggleProps {
  multiRole: boolean;
  toggleMultiRole: (checked: boolean) => void;
}

export function MultiRoleToggle({
  multiRole,
  toggleMultiRole,
}: MultiRoleToggleProps) {
  return (
    <div className="form-group">
      <div className="toggle-row">
        <div className="toggle-row-content">
          <span className="material-icons-round">groups</span>
          <div>
            <span className="toggle-label">Multi-Role Mode</span>
            <span className="toggle-sub">
              Test a story across multiple roles and URLs
            </span>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={multiRole}
            onChange={(e) => toggleMultiRole(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );
}