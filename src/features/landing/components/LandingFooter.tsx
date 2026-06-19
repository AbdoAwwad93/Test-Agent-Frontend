import Link from "next/link";

export function LandingFooter() {
  return (
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
  );
}