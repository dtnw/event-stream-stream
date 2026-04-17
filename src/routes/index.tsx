import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { EventCard } from "@/components/event-card";
import { useEvents } from "@/hooks/use-events";
import {
  ALL_CATEGORIES,
  CATEGORY_META,
  isToday,
  type Category,
} from "@/lib/events";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "campuslive — every campus event in one place" },
      {
        name: "description",
        content:
          "The unified feed of campus events. Filter by free food, club, faculty, career, ticketed and more. Built for students.",
      },
    ],
  }),
});

type FilterKey = Category | "today";

function Index() {
  const events = useEvents();
  const [active, setActive] = useState<Set<FilterKey>>(new Set());

  const toggle = (k: FilterKey) => {
    const next = new Set(active);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setActive(next);
  };

  const filtered = useMemo(() => {
    const arr = [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    if (active.size === 0) return arr;
    return arr.filter((e) => {
      for (const k of active) {
        if (k === "today") {
          if (!isToday(e.date)) return false;
        } else if (!e.categories.includes(k)) {
          return false;
        }
      }
      return true;
    });
  }, [events, active]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b bg-background">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[1.1fr,1fr] md:items-center md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-cat-food px-3 py-1 text-xs font-bold uppercase tracking-wider text-cat-food-foreground">
              one feed · zero scrolling instagram
            </p>
            <h1 className="font-display text-5xl font-black leading-[1.05] text-primary md:text-6xl">
              Every campus event.
              <br />
              <span className="text-foreground">One place.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Stop hunting across Discord, posters, and email threads. See
              what's happening today, filter by free food, your faculty, or
              your club — and RSVP in one tap.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <a
                href="#feed"
                className="rounded-full bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-sm transition hover:brightness-95"
              >
                Browse events →
              </a>
              <span className="text-sm text-muted-foreground">
                {events.length} events live
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-3xl bg-cat-food p-6 text-5xl shadow-sm">
                🍕
                <p className="mt-3 font-display text-base font-extrabold text-cat-food-foreground">
                  Free food today
                </p>
              </div>
              <div className="mt-8 aspect-square rounded-3xl bg-cat-club p-6 text-5xl shadow-sm">
                🎨
                <p className="mt-3 font-display text-base font-extrabold text-cat-club-foreground">
                  Club nights
                </p>
              </div>
              <div className="aspect-square rounded-3xl bg-cat-career p-6 text-5xl shadow-sm">
                💼
                <p className="mt-3 font-display text-base font-extrabold text-cat-career-foreground">
                  Career fairs
                </p>
              </div>
              <div className="mt-8 aspect-square rounded-3xl bg-cat-social p-6 text-5xl shadow-sm">
                🎉
                <p className="mt-3 font-display text-base font-extrabold text-cat-social-foreground">
                  Socials
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section id="feed" className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl font-extrabold text-primary">
            What's on
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {events.length}
          </p>
        </div>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          <FilterChip
            label="Today"
            active={active.has("today")}
            onClick={() => toggle("today")}
            icon="⚡"
          />
          {ALL_CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              label={CATEGORY_META[c].label}
              active={active.has(c)}
              onClick={() => toggle(c)}
              icon={CATEGORY_META[c].icon}
            />
          ))}
          {active.size > 0 && (
            <button
              onClick={() => setActive(new Set())}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground underline-offset-2 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed py-20 text-center">
            <p className="text-4xl">🦗</p>
            <p className="mt-3 font-display text-xl font-bold">
              Nothing matches those filters
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try removing a chip or two.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        Built for students · campuslive
      </footer>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-card text-foreground ring-1 ring-border hover:bg-muted"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
