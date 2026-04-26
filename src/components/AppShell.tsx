"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div id="app">
      <Sidebar pathname={pathname} />
      <main className="main">{children}</main>
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  const items = [
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/runs/new", icon: "add_circle", label: "New Run" },
    { href: "/runs/live", icon: "terminal", label: "Live Execution" },
    { href: "/history", icon: "history", label: "History" },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <span className="material-icons-round">graphic_eq</span>
        </div>
        <div>
          <span className="brand-name">Nomad AI Agent</span>
          <span className="brand-sub">Quiet Intelligence</span>
        </div>
      </div>
      <div className="sidebar-nav">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${isActive ? " active" : ""}`}
            >
              <span className="material-icons-round">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
