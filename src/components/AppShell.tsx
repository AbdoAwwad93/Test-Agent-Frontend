"use client";

import { useHealth } from "@/features/appShell/hooks/useRunAction";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import "../features/appShell/appShell.css"

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div id="app">
      <Sidebar
        pathname={pathname}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <main className="main">{children}</main>
    </div>
  );
}

function Sidebar({
  pathname,
  isOpen,
  onToggle,
}: {
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { data, isError, isPending } = useHealth();
  const apiStatus: "checking" | "online" | "offline" = isPending
    ? "checking"
    : isError || !data
      ? "offline"
      : "online";

  const items = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/runs/new", icon: "add_circle", label: "New Run" },
    { href: "/runs/live", icon: "terminal", label: "Live Execution" },
    { href: "/history", icon: "history", label: "History" },
  ];

  return (
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
  );
}