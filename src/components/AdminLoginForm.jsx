"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icons";

/**
 * The single admin sign-in. Credentials are checked on the server against
 * ADMIN_EMAIL / ADMIN_PASSWORD; nothing about them exists in this bundle.
 */
export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Sign-in failed. Please try again.");
      }

      // The dashboard reads the cookie on the server, so re-fetch the route
      // rather than navigating client-side with stale data.
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setPassword("");
      setMessage(err.message);
    }
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="a-email">Admin email</label>
        <input
          id="a-email"
          type="email"
          className="input"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="a-password">Password</label>
        <input
          id="a-password"
          type="password"
          className="input"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {status === "error" ? (
        <p className="form-alert" role="alert">
          <Icon name="alert" />
          <span>{message}</span>
        </p>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary btn-lg btn-block"
        disabled={status === "sending"}
      >
        <Icon name={status === "sending" ? "clock" : "lock"} />
        {status === "sending" ? "Checking…" : "Sign in"}
      </button>

      <p className="hint">
        This area is for staff only. Customers never need an account.
      </p>
    </form>
  );
}
