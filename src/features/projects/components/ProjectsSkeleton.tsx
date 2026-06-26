import "../projects.css"
export function ProjectsSkeleton() {
  return (
    <div className="skeleton-list">
      <div className="skeleton" style={{ height: "160px" }}></div>
      <div className="skeleton" style={{ height: "160px" }}></div>
      <div className="skeleton" style={{ height: "160px" }}></div>
    </div>
  );
}