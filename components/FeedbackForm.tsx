"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function FeedbackForm() {
  const [useful, setUseful] = useState<"yes" | "no" | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!useful) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useful, comment }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-card-border bg-card p-6 text-center">
        <p className="text-heading font-medium">
          Thank you. This directly shapes the next version.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-card-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6">
      <h2 className="text-xl font-semibold text-heading mb-1">Before you go — was this useful?</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <p className="text-sm font-medium text-heading mb-2">
            If a full version of this existed, would it help you study for your C++ course?
          </p>
          <div className="flex gap-3" role="group" aria-label="Would this help you study?">
            <button
              type="button"
              onClick={() => setUseful("yes")}
              aria-pressed={useful === "yes"}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                useful === "yes"
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-body border-card-border hover:border-accent"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setUseful("no")}
              aria-pressed={useful === "no"}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                useful === "no"
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-body border-card-border hover:border-accent"
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="feedback-comment" className="block text-sm font-medium text-heading mb-1">
            What would make this genuinely useful to you? Tell me what confused you, what&rsquo;s
            missing, or what you&rsquo;d add. Be honest — it shapes the next version.
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your honest thoughts…"
            rows={4}
            className="w-full rounded-xl border border-card-border px-3 py-2 text-sm"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-error">
            Something went wrong sending your feedback. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={!useful || status === "submitting"}
          className="px-5 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending…" : "Send feedback"}
        </button>
      </form>
    </div>
  );
}
