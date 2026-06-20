import { recentRuns } from "../data/landing.data";
import "../landing.css"

export function InsightsDashboard() {
  return (
    <section id="insights" className="landing-section">
      <div className="landing-insights">
        <div className="landing-insights-copy">
          <p className="landing-eyebrow">Live Visibility</p>
          <h2>Insightful observation, not noisy reporting.</h2>
          <blockquote>
            The agent does not just pass tests. It helps teams understand
            whether the product experience still feels intact.
          </blockquote>
          <p>
            Monitor execution quality through a dashboard that highlights
            state, evidence, and meaningful regressions without drowning the
            team in logs.
          </p>
        </div>

        <div className="landing-dashboard-card">
          <div className="landing-dashboard-header">
            <div>
              <h3>Execution Overview</h3>
              <p>Real-time status of agent activity</p>
            </div>
            <div className="landing-live-indicator">
              <span />
              Live Monitor
            </div>
          </div>

          <div className="landing-dashboard-stats">
            <div>
              <p>Total Executions</p>
              <strong>1,284</strong>
            </div>
            <div className="accent">
              <p>Success Rate</p>
              <strong>94.2%</strong>
            </div>
            <div>
              <p>Avg Duration</p>
              <strong>1.4s</strong>
            </div>
          </div>

          <div className="landing-run-list">
            <p className="landing-run-list-title">Recent Runs</p>
            {recentRuns.map((run) => (
              <div key={run.name} className="landing-run-item">
                <div className="landing-run-meta">
                  <span
                    className={`material-icons-round landing-run-icon ${run.tone}`}
                  >
                    {run.icon}
                  </span>
                  <div>
                    <strong>{run.name}</strong>
                    <p>{run.meta}</p>
                  </div>
                </div>
                <span className={`landing-run-badge ${run.tone}`}>
                  {run.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}