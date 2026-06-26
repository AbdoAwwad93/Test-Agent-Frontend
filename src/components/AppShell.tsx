"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import "../features/appShell/appShell.css"
import "../features/Auth/auth.css"
import { Sidebar } from "@/features/appShell/components/Sidebar";

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