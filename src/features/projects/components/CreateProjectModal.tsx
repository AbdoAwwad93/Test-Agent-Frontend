"use client";
import "../projects.css"

interface CreateProjectModalProps {
  newName: string;
  newDesc: string;
  setNewName: (value: string) => void;
  setNewDesc: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isCreating: boolean;
  createError: string | null;
}

export function CreateProjectModal({
  newName,
  newDesc,
  setNewName,
  setNewDesc,
  onClose,
  onSubmit,
  isCreating,
  createError,
}: CreateProjectModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-title">New Project</span>
        <div className="form-group">
          <label className="form-label" htmlFor="project-name">
            <span className="material-icons-round">badge</span>
            Name
          </label>
          <input
            id="project-name"
            type="text"
            className="form-input"
            placeholder="My Project"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="project-desc">
            <span className="material-icons-round">description</span>
            Description (optional)
          </label>
          <textarea
            id="project-desc"
            className="form-textarea"
            placeholder="What is this project about?"
            rows={3}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={!newName.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
        {createError && (
          <div className="form-error">
            <span className="material-icons-round">error_outline</span>
            <span>{createError}</span>
          </div>
        )}
      </div>
    </div>
  );
}