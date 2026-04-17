import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  CATEGORY_META,
  formatWhen,
  getEvent,
  isToday,
  rsvp,
  toggleInterested,
} from "@/lib/events";
import { useEvents } from "@/hooks/use-events";

const INTERESTED_KEY = "loc:interested:v1";

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetail,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-5xl">🤷</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold">
          Event not found
        </h1>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-cta px-5 py-2 font-bold text-cta-foreground"
        >
          Back to feed
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
  loader: ({ params }) => {
    const ev = getEvent(params.eventId);
    if (!ev) throw new Error("Not found");
    return ev;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · campuslive` },
          { name: "description", content: loaderData.description },
        ]
      : [],
  }),
});

function EventDetail() {
  const { eventId } = Route.useParams();
  // subscribe to live updates
  useEvents();
  const event = getEvent(eventId);
  const navigate = useNavigate();
  const [rsvped, setRsvped] = useState(false);
  const [interested, setInterested] = useState(false);

  // Restore interested state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(INTERESTED_KEY);
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      setInterested(set.has(eventId));
    } catch {
      // ignore
    }
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <p className="text-5xl">🤷</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold">
            Event not found
          </h1>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-6 rounded-full bg-cta px-5 py-2 font-bold text-cta-foreground"
          >
            Back to feed
          </button>
        </div>
      </div>
    );
  }

  const primary = event.categories[0] ?? "social";
  const meta = CATEGORY_META[primary];

  const handleRsvp = () => {
    if (rsvped) return;
    rsvp(event.id);
    setRsvped(true);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          ← Back to feed
        </Link>

        <div className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border">
          <div
            className={`${meta.cardClass} flex aspect-[16/7] items-center justify-center text-9xl`}
          >
            {event.emoji}
          </div>
          <div className="space-y-6 p-8">
            <div className="flex flex-wrap gap-1.5">
              {event.categories.map((c) => (
                <span
                  key={c}
                  className={`${CATEGORY_META[c].chipClass} rounded-full px-3 py-1 text-xs font-semibold`}
                >
                  {CATEGORY_META[c].label}
                </span>
              ))}
            </div>

            <div>
              <h1 className="font-display text-4xl font-black leading-tight text-foreground">
                {event.title}
              </h1>
              <p className="mt-1 text-base text-muted-foreground">
                Hosted by {event.host}
              </p>
            </div>

            <div className="grid gap-4 rounded-2xl bg-muted/50 p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  When
                </p>
                <p
                  className={`mt-1 font-semibold ${isToday(event.date) ? "text-primary" : ""}`}
                >
                  {formatWhen(event.date)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Where
                </p>
                <p className="mt-1 font-semibold">{event.location}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Cost
                </p>
                <p className="mt-1 font-semibold">{event.cost ?? "Free"}</p>
              </div>
            </div>

            <p className="text-base leading-relaxed text-foreground">
              {event.description}
            </p>

            <div className="rounded-2xl bg-cat-faculty/40 p-4 text-sm text-cat-faculty-foreground">
              <span className="font-bold">Why you're seeing this:</span>{" "}
              matches the categories you've been browsing on campuslive.
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
              <p className="text-sm text-muted-foreground">
                <span className="text-2xl font-display font-extrabold text-foreground">
                  {event.rsvps}
                </span>{" "}
                students going
              </p>
              <button
                onClick={handleRsvp}
                disabled={rsvped}
                className="rounded-full bg-cta px-8 py-3 font-bold text-cta-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {rsvped ? "✓ You're going" : "RSVP — one tap"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
