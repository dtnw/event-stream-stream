import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { EventRow } from "@/components/event-row";
import { useEvents } from "@/hooks/use-events";
import { useNotifyPrefs } from "@/hooks/use-notify-prefs";
import {
  ALL_CATEGORIES,
  CATEGORY_META,
  isToday,
  type Category,
  type CampusEvent,
} from "@/lib/events";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Live On Campus — every campus event in one place" },
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
  const { prefs, toggle: togglePref } = useNotifyPrefs();

  const toggle = (k: FilterKey) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
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

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <p className="mb-2 inline-block rounded-full bg-cat-food px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cat-food-foreground">
            one feed · zero scrolling instagram
          </p>
          <h1 className="font-display text-3xl font-black leading-[1.05] text-primary md:text-5xl">
            Every campus event.
            <span className="text-foreground"> One place.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            See what's on today, this week, and next — filter by free food,
            faculty, or club. RSVP in one tap.
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <a
              href="#feed"
              className="rounded-full bg-cta px-4 py-2 text-xs font-bold text-cta-foreground shadow-sm transition hover:brightness-95"
            >
              Browse events →
            </a>
            <span>{events.length} live</span>
          </div>
        </div>
      </section>

      {/* Notify preferences */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-extrabold text-foreground">
                🔔 Notify me about
              </h2>
              <p className="text-xs text-muted-foreground">
                Tap categories you care about. We'll ping you when new ones drop.
              </p>
            </div>
            {prefs.size > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {prefs.size} on
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((c) => {
              const on = prefs.has(c);
              return (
                <button
                  key={c}
                  onClick={() => togglePref(c)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    on
                      ? `${CATEGORY_META[c].chipClass} ring-2 ring-primary`
                      : "bg-muted text-muted-foreground ring-1 ring-border hover:bg-card"
                  }`}
                >
                  <span aria-hidden>{CATEGORY_META[c].icon}</span>
                  <span>{CATEGORY_META[c].label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feed */}
      <section id="feed" className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold text-primary">
            What's on
          </h2>
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {events.length}
          </p>
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
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
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed py-16 text-center">
            <p className="text-3xl">🦗</p>
            <p className="mt-2 font-display text-lg font-bold">
              Nothing matches those filters
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try removing a chip or two.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(({ key, label, items }) => (
              <div key={key}>
                <div className="mb-2 flex items-baseline justify-between border-b pb-1">
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-foreground">
                    {label}
                  </h3>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {items.length} event{items.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {items.map((e) => (
                    <EventRow key={e.id} event={e} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        Built for students · Live On Campus
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
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-card text-foreground ring-1 ring-border hover:bg-muted"
      }`}
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function groupByDate(events: CampusEvent[]) {
  const groups = new Map<string, { label: string; items: CampusEvent[] }>();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  for (const e of events) {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    let label: string;
    if (d.toDateString() === today.toDateString()) label = "Today";
    else if (d.toDateString() === tomorrow.toDateString()) label = "Tomorrow";
    else
      label = d.toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    if (!groups.has(key)) groups.set(key, { label, items: [] });
    groups.get(key)!.items.push(e);
  }
  return [...groups.entries()].map(([key, v]) => ({ key, ...v }));
}
