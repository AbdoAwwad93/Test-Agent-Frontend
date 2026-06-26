import "../../projects.css"


export function ProjectDetailSkeleton() {
  return (
    <div className="page active">
      <div className="skeleton-list">
        <div className="skeleton" style={{ height: "100px" }} />
        <div className="skeleton" style={{ height: "60px" }} />
      </div>
    </div>
  );
}