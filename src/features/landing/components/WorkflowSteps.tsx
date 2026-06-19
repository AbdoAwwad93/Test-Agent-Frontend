import { steps } from "../landing.data";

export function WorkflowSteps() {
  return (
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
  );
}