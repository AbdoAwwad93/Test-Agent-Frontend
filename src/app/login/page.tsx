"use client";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLogin } from "@/features/Auth/hooks/UseLogin";
import "../../features/Auth/auth.css";

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();
  const [loginStr, setLoginStr] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login({ login: loginStr, password });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div className="auth-page auth-page-split">
      {/* Left side: brand + form */}
      <div className="auth-left">
        {/* Brand fixed at top-left */}
        <div className="auth-brand">
          <Image
            src="/assets/logo_white.png"
            alt="Nomad Agent"
            width={120}
            height={36}
            className="auth-brand-logo auth-brand-logo--dark"
            style={{ color: "unset" }}
            priority
          />
          <Image
            src="/assets/logo_dark.png"
            alt="Nomad Agent"
            width={120}
            height={36}
            className="auth-brand-logo auth-brand-logo--light"
            style={{ color: "unset" }}
            priority
          />
          <span className="auth-brand-name">Nomad Agent</span>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Log in to your account</p>
          </div>

          {error && (
            <div className="form-error">
              <span className="material-icons-round">error</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login">
              <span className="material-icons-round">person</span>
              Email or Username
            </label>
            <input
              id="login"
              className="form-input"
              type="text"
              placeholder="you@example.com"
              value={loginStr}
              onChange={(e) => setLoginStr(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <span className="material-icons-round">lock</span>
              Password
            </label>
            <div className="password-wrap">
              <input
                id="password"
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-icons-round">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large auth-submit"
            disabled={isPending}
          >
            {isPending ? "Logging in…" : "Log In"}
          </button>

          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link href="/register">Create one</Link>
          </p>
        </form>
      </div>

      {/* Right side: marketing copy */}
      <div className="auth-right">
        <div className="auth-right-content">
          <h2 className="auth-right-title">
            Your tireless Test Agent,
            <br />
            always on the job.
          </h2>
          <p className="auth-right-text">
            Nomad Agent reviews, runs, and catches issues before they ever
            reach your users. Ship faster, with fewer surprises and more
            confidence in every deploy.
          </p>

          <div className="auth-feature-grid">
            <div className="auth-feature-card">
              <span className="material-icons-round auth-feature-icon">schedule</span>
              <h3>Always running</h3>
              <p>Automated testing, around the clock, no manual triggers needed.</p>
            </div>
            <div className="auth-feature-card">
              <span className="material-icons-round auth-feature-icon">bug_report</span>
              <h3>Catches issues early</h3>
              <p>Finds bugs long before your users ever do.</p>
            </div>
            <div className="auth-feature-card">
              <span className="material-icons-round auth-feature-icon">insights</span>
              <h3>Clear reporting</h3>
              <p>Readable reports that help you decide faster.</p>
            </div>
            <div className="auth-feature-card">
              <span className="material-icons-round auth-feature-icon">bolt</span>
              <h3>Faster shipping</h3>
              <p>Ship with confidence on every single deploy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}