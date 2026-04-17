import { Link } from "@tanstack/react-router";
import deakinLogo from "@/assets/deakin-logo.webp";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={deakinLogo}
            alt="Deakin University"
            className="h-8 w-8 rounded-full bg-white object-contain"
          />
          <span className="font-display text-lg font-black tracking-tight sm:text-2xl">
            Live On Campus
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold sm:flex">
          <Link to="/" className="hover:opacity-80" activeOptions={{ exact: true }}>
            Discover
          </Link>
          <Link to="/admin" className="hover:opacity-80">
            Post an event
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-primary-foreground/30 transition hover:bg-primary-foreground/10 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/admin"
            className="rounded-full bg-cta px-4 py-2 text-xs font-bold text-cta-foreground shadow-sm transition hover:brightness-95 sm:px-5 sm:text-sm"
          >
            + Add event
          </Link>
        </div>
      </div>
    </header>
  );
}
