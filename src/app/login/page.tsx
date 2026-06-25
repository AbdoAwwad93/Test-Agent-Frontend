"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <div className="auth-page">
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
  );
}