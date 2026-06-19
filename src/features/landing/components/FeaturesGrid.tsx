import { features } from "../landing.data";
import "../landing.css"

export function FeaturesGrid() {
  return (
    <section id="features" className="landing-section landing-section-bordered">
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
  );
}