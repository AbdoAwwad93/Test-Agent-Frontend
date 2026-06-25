"use client";

import { useRef } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth-context";

import "../landing.css"
import { useActiveSectionNav } from "../hooks/Usescrolleffects";

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
        <a href="#product">Product</a>
        <a href="#workflow">Workflow</a>
        <a href="#insights">Insights</a>
        <a href="#features">Features</a>
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
        ) : (
          <>
            <Link href="/login" className="landing-link-button">
              Log In
            </Link>
            <Link href="/register" className="landing-link-button">
              Sign Up
            </Link>
            <Link href="/dashboard" replace className="landing-link-button">
              Dashboard
            </Link>
          </>
        )}
        <Link href="/runs/new" className="landing-button landing-button-primary">
          Start Testing Free
        </Link>
      </div>
    </nav>
  );
}