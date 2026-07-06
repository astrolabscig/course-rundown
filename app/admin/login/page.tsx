"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Incorrect password.");
        setSubmitting(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-lg border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6">
        <h1 className="text-xl font-semibold text-heading mb-4">Admin login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-heading mb-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-card-border px-3 py-2 text-sm"
              required
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
