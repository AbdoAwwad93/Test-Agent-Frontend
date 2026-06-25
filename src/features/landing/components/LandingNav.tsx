"use client";
import { useRef } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth-context";
import "../landing.css"
import { useActiveSectionNav } from "../hooks/Usescrolleffects";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function LandingNav() {
  const navRef = useRef<HTMLElement>(null);
  const { status, user } = useAuth();
  const isAuthenticated = status === "authenticated";

  useActiveSectionNav(navRef, ["product", "workflow", "insights", "features"]);

  return (
    <nav className="landing-nav" ref={navRef}>
      <Link href="/" className="landing-brand">
        Nomad AI Agent
      </Link>

      <div className="landing-nav-links">
        <button onClick={() => scrollToSection("product")}>Product</button>
        <button onClick={() => scrollToSection("workflow")}>Workflow</button>
        <button onClick={() => scrollToSection("insights")}>Insights</button>
        <button onClick={() => scrollToSection("features")}>Features</button>
      </div>

      <div className="landing-nav-actions">
        <ThemeToggle />
        {isAuthenticated ? (
          <Link href="/dashboard" replace className="landing-link-button landing-user-btn">
            <span className="landing-avatar-mini">
              {(user?.full_name || user?.username || "U").charAt(0).toUpperCase()}
            </span>
            Dashboard
          </Link>
        ) : null}
        <Link href="/runs/new" className="landing-button landing-button-primary">
          Start Testing Free
        </Link>
      </div>
    </nav>
  );
}