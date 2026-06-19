import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function LandingNav() {
  return (
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
  );
}