"use client";

import { useHealth } from "@/features/appShell/hooks/useRunAction";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import "../features/appShell/appShell.css"
import "../features/Auth/auth.css"
const PROTECTED_ROUTES = [
  "/dashboard",
  "/history",
  "/projects",
  "/runs/new",
  "/runs/live",
  "/runs",
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, user } = useAuth();
  const isLandingPage = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Redirect to login when accessing protected routes while unauthenticated
  const isProtected = PROTECTED_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

  useEffect(() => {
    if (status === "unauthenticated" && isProtected) {
      router.replace("/login");
    }
  }, [status, isProtected, router]);

  if (status === "loading") {
    return (
      <div className="auth-loading">
        <span className="material-icons-round">graphic_eq</span>
      </div>
    );
  }

  if (isLandingPage || isAuthPage) {
    return <>{children}</>;
  }

  // While redirecting, render nothing
  if (status === "unauthenticated" && isProtected) {
    return null;
  }

  return (
    <div id="app">
      <Sidebar
        pathname={pathname}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        user={user}
        status={status}
      />
      <main className="main">{children}</main>
    </div>
  );
}

function Sidebar({
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
  const apiStatus: "checking" | "online" | "offline" = isPending
    ? "checking"
    : isError || !data
      ? "offline"
      : "online";

  const items = [
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/runs/new", icon: "add_circle", label: "New Run" },
    { href: "/runs/live", icon: "terminal", label: "Live Execution" },
    { href: "/projects", icon: "folder", label: "Projects" },
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
                onClick={logout}
                data-tooltip="Log out"
                aria-label="Log out"
              >
                <span className="material-icons-round">logout</span>
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
  );
}
