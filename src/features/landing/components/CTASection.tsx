import Link from "next/link";
import "../landing.css"
export function CTASection() {
  return (
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
  );
}