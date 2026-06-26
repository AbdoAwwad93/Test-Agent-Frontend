"use client";

import { useHealth } from "@/features/appShell/hooks/useRunAction";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useState } from "react";
import "../appShell.css";
import "../../Auth/auth.css";

export function Sidebar({
  pathname,
  isOpen,
  onToggle,
  user,
  status,
}: {
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  user: ReturnType<typeof useAuth>["user"];
  status: ReturnType<typeof useAuth>["status"];
}) {
  const { data, isError, isPending } = useHealth();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const apiStatus: "checking" | "online" | "offline" = isPending
    ? "checking"
    : isError || !data
      ? "offline"
      : "online";

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setIsLoggingOut(false);
    }
  };

  const items = [
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/runs/new", icon: "add_circle", label: "New Run" },
    { href: "/runs/live", icon: "terminal", label: "Live Execution" },
    { href: "/projects", icon: "folder", label: "Projects" },
    { href: "/history", icon: "history", label: "History" },
  ];

  return (
    <>
      {isLoggingOut && (
        <div className="logout-overlay" role="status" aria-live="polite">
          <div className="logout-overlay-content">
            <span className="material-icons-round logout-overlay-icon">
              autorenew
            </span>
            <p>Signing you out…</p>
          </div>
        </div>
      )}

      <nav className={`sidebar${isOpen ? "" : " sidebar--collapsed"}`}>
        <div className="sidebar-controls">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-pressed={isOpen}
            data-tooltip={isOpen ? undefined : "Expand sidebar"}
          >
            <span className="material-icons-round">view_sidebar</span>
          </button>
        </div>

        {isOpen && (
          <div className="sidebar-brand">
            <div className="brand-icon">
              <span className="material-icons-round">graphic_eq</span>
            </div>
            <div>
              <span className="brand-name">Nomad AI Agent</span>
              <span className="brand-sub">Quiet Intelligence</span>
            </div>
          </div>
        )}

        <div className="sidebar-nav">
          {items.map((item) => {
            const isActive =
              (item.href === "/" && pathname === "/") ||
              (item.href !== "/" &&
                (pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(`${item.href}/`))));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${isActive ? " active" : ""}`}
                data-tooltip={isOpen ? undefined : item.label}
              >
                <span className="material-icons-round">{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {isOpen && (
          <div className="sidebar-footer">
            {status === "authenticated" && user ? (
              <div className="auth-section">
                <div className="auth-user">
                  <div className="auth-avatar">
                    {user.full_name?.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="auth-user-info">
                    <span className="auth-user-name">{user.full_name || user.username}</span>
                    <span className="auth-user-email">{user.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="auth-logout-btn"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  data-tooltip={isLoggingOut ? "Logging out…" : "Log out"}
                  aria-label="Log out"
                  aria-busy={isLoggingOut}
                >
                  <span className={`material-icons-round${isLoggingOut ? " spin" : ""}`}>
                    {isLoggingOut ? "autorenew" : "logout"}
                  </span>
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link href="/login" className="btn btn-primary btn-small">Log In</Link>
                <Link href="/register" className="btn btn-secondary btn-small">Sign Up</Link>
              </div>
            )}
            <div className="status-indicator">
              <span
                className={`dot ${
                  apiStatus === "online"
                    ? "pass"
                    : apiStatus === "offline"
                      ? "fail"
                      : "idle"
                }`}
              />
              <span>
                {apiStatus === "online"
                  ? "API Online"
                  : apiStatus === "offline"
                    ? "API Offline"
                    : "Checking API"}
              </span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}