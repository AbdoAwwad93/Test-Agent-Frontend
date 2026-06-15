import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const steps = [
  {
    number: "Step 01",
    title: "Enter URL",
    description:
      "Provide the starting point for your agent. No configuration files or brittle selectors, just the product surface you want explored.",
  },
  {
    number: "Step 02",
    title: "AI Explores",
    description:
      "Nomad navigates flows, interprets interface context, and validates journeys with the patience of a careful human tester.",
  },
  {
    number: "Step 03",
    title: "Get Results",
    description:
      "Review visual evidence, execution history, and outcome summaries that make triage faster for the whole team.",
  },
];

const features = [
  {
    icon: "explore",
    title: "Autonomous Browser Navigation",
    description:
      "Agents traverse product logic without hand-authored scripts for every branch and state.",
  },
  {
    icon: "monitoring",
    title: "Real-Time Execution Monitoring",
    description:
      "Observe each run as it happens so product and QA teams can understand behavior instantly.",
  },
  {
    icon: "visibility",
    title: "Visual Regression Detection",
    description:
      "Spot subtle UI shifts before they make it into production and erode trust in the experience.",
  },
  {
    icon: "receipt_long",
    title: "Detailed Logs and Screenshots",
    description:
      "Every meaningful interaction is captured with the context needed to debug efficiently.",
  },
  {
    icon: "integration_instructions",
    title: "CI and Deployment Ready",
    description:
      "Fit the testing workflow into your existing release pipeline without introducing heavy process overhead.",
  },
  {
    icon: "groups",
    title: "Shared Team Visibility",
    description:
      "Keep engineers, QA, and product aligned around one clear record of what the agent discovered.",
  },
];

const recentRuns = [
  {
    name: "Checkout Flow Validation",
    meta: "4 minutes ago - Chrome 124",
    status: "Pass",
    tone: "pass",
    icon: "check_circle",
  },
  {
    name: "User Authentication Journey",
    meta: "12 minutes ago - Firefox 112",
    status: "Fail",
    tone: "fail",
    icon: "error",
  },
  {
    name: "Dashboard Widget Loading",
    meta: "28 minutes ago - Safari 17",
    status: "Pass",
    tone: "pass",
    icon: "check_circle",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link href="/" className="landing-brand">
          Nomad AI Agent
        </Link>
        <div className="landing-nav-links">
          <a href="#product">Product</a>
          <a href="#workflow">Workflow</a>
          <a href="#insights">Insights</a>
          <a href="#features">Features</a>
        </div>
        <div className="landing-nav-actions">
          <ThemeToggle />
          <Link href="/dashboard" replace className="landing-link-button">
            Dashboard
          </Link>
          <Link href="/runs/new" className="landing-button landing-button-primary">
            Start Testing Free
          </Link>
        </div>
      </nav>

      <main className="landing-main">
        <section id="product" className="landing-hero">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow">Autonomous Web Testing</p>
            <h1>
              Autonomous testing for the <span>intellectual explorer.</span>
            </h1>
            <p className="landing-lead">
              Nomad AI Agent explores your application like a thoughtful
              engineer, validating flows, documenting failures, and surfacing
              high-signal results without the busywork of brittle scripts.
            </p>
            <div className="landing-hero-actions">
              <Link
                href="/runs/new"
                className="landing-button landing-button-primary"
              >
                Start Testing Free
              </Link>
              <Link
                href="/dashboard"
                replace
                className="landing-button landing-button-secondary"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="landing-hero-media">
            <div className="landing-hero-glow" />
            <Image
              src="/landing-page-hero.png"
              alt="Nomad AI Agent landing page hero"
              width={1600}
              height={1200}
              priority
              className="landing-hero-image"
            />
          </div>
        </section>

        <section id="workflow" className="landing-section landing-section-muted">
          <div className="landing-section-heading centered">
            <p className="landing-eyebrow">How It Works</p>
            <h2>Designed for sophisticated engineering.</h2>
            <p>
              A clear workflow that keeps testing lightweight at the start and
              rigorous when it matters.
            </p>
          </div>
          <div className="landing-steps">
            {steps.map((step) => (
              <article key={step.number} className="landing-step-card">
                <p className="landing-step-number">{step.number}</p>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className="landing-step-line" />
              </article>
            ))}
          </div>
        </section>

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

        <section
          id="features"
          className="landing-section landing-section-bordered"
        >
          <div className="landing-features">
            {features.map((feature) => (
              <article key={feature.title} className="landing-feature-card">
                <span className="material-icons-round">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-cta-card">
            <div className="landing-cta-glow" />
            <p className="landing-eyebrow">Ready When You Are</p>
            <h2>Explore the frontier of testing with a calmer workflow.</h2>
            <p>
              Bring the current product into view, launch a run, and let Nomad
              handle the repetitive parts with more consistency than manual
              checks can sustain.
            </p>
            <div className="landing-hero-actions">
              <Link
                href="/runs/new"
                className="landing-button landing-button-primary"
              >
                Start Testing Free
              </Link>
              <Link href="/dashboard" replace className="landing-link-button">
                Open Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div>
          <p className="landing-brand">Nomad AI Agent</p>
          <p>Crafted for deliberate, high-signal browser testing.</p>
        </div>
        <div className="landing-footer-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/runs/new">New Run</Link>
          <Link href="/history">History</Link>
        </div>
      </footer>
    </div>
  );
}
