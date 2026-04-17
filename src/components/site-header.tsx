import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-black tracking-tight">
            campuslive
          </span>
          <span className="text-xl">✦</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold sm:flex">
          <Link to="/" className="hover:opacity-80" activeOptions={{ exact: true }}>
            Discover
          </Link>
          <Link to="/admin" className="hover:opacity-80">
            Post an event
          </Link>
        </nav>
        <Link
          to="/admin"
          className="rounded-full bg-cta px-5 py-2 text-sm font-bold text-cta-foreground shadow-sm transition hover:brightness-95"
        >
          + Add event
        </Link>
      </div>
    </header>
  );
}
