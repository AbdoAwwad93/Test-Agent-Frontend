import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
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
  );
}