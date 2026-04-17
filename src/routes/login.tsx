import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import deakinLogo from "@/assets/deakin-logo.webp";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in · Live On Campus" },
      {
        name: "description",
        content:
          "Sign in to Live On Campus with your Deakin University account to RSVP and get notified about events.",
      },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSso = async () => {
    setLoading(true);
    // Placeholder for Deakin SSO redirect (SAML / OAuth)
    // Wire to Lovable Cloud auth (SAML SSO) once enabled.
    await new Promise((r) => setTimeout(r, 700));
    try {
      localStorage.setItem("loc:auth:v1", JSON.stringify({ provider: "deakin", at: Date.now() }));
    } catch {
      // ignore
    }
    setLoading(false);
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-10">
        <Link to="/" className="mb-8 flex items-center gap-2 text-primary">
          <span className="text-xl" aria-hidden>✦</span>
          <span className="font-display text-xl font-black tracking-tight">
            Live On Campus
          </span>
        </Link>

        <div className="w-full rounded-3xl bg-card p-7 shadow-sm ring-1 ring-border">
          <div className="mb-5 flex flex-col items-center text-center">
            <img
              src={deakinLogo}
              alt="Deakin University"
              className="h-20 w-20 rounded-full bg-white object-contain ring-1 ring-border"
            />
            <h1 className="mt-4 font-display text-2xl font-black text-foreground">
              Sign in to Live On Campus
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Use your Deakin University account to RSVP, save events, and get
              notified about what's on.
            </p>
          </div>

          <button
            onClick={handleSso}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-60"
          >
            <img
              src={deakinLogo}
              alt=""
              className="h-6 w-6 rounded-full bg-white"
              aria-hidden
            />
            {loading ? "Redirecting to Deakin…" : "Continue with Deakin SSO"}
          </button>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            You'll be redirected to <span className="font-semibold">login.deakin.edu.au</span> to
            authenticate, then sent back here.
          </p>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Staff & guests
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            disabled
            className="w-full rounded-xl bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground ring-1 ring-border"
          >
            Sign in with email (coming soon)
          </button>
        </div>

        <p className="mt-6 max-w-xs text-center text-[11px] text-muted-foreground">
          By continuing you agree to use Live On Campus in line with Deakin's
          acceptable use policy.
        </p>

        <Link
          to="/"
          className="mt-4 text-xs font-semibold text-primary hover:underline"
        >
          ← Back to events
        </Link>
      </div>
    </div>
  );
}
