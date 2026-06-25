"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegister } from "@/features/Auth/hooks/UseRegister";

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync: register, isPending, error } = useRegister();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await register({ email, username, password, full_name: fullName || null });
      router.replace("/dashboard");
    } catch {
    }
  }

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join Nomad AI Agent</p>
        </div>

        {errorMessage && (
          <div className="form-error">
            <span className="material-icons-round">error</span>
            {errorMessage}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            <span className="material-icons-round">email</span>
            Email
          </label>
          <input
            id="email"
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="username">
            <span className="material-icons-round">badge</span>
            Username
          </label>
          <input
            id="username"
            className="form-input"
            type="text"
            placeholder="your-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="fullName">
            <span className="material-icons-round">person</span>
            Full Name <span className="optional">(optional)</span>
          </label>
          <input
            id="fullName"
            className="form-input"
            type="text"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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
          {isPending ? "Creating account…" : "Create Account"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}