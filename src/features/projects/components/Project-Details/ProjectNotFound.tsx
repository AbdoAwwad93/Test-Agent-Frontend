import "../../projects.css"

export function ProjectNotFound() {
  return (
    <div className="page active">
      <div className="empty-state">
        <p>
          <strong>Project not found.</strong>
        </p>
      </div>
    </div>
  );
}