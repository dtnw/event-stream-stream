import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-black tracking-tight sm:text-2xl">
            Live On Campus
          </span>
        </Link>
        <Link
          to="/login"
          className="rounded-full bg-cta px-4 py-2 text-xs font-bold text-cta-foreground shadow-sm transition hover:brightness-95 sm:px-5 sm:text-sm"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
