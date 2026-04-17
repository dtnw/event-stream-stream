import { Link } from "@tanstack/react-router";
import { CATEGORY_META, formatWhen, isToday, type CampusEvent } from "@/lib/events";

export function EventCard({ event }: { event: CampusEvent }) {
  const primary = event.categories[0] ?? "social";
  const meta = CATEGORY_META[primary];
  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: event.id }}
      className="group block overflow-hidden rounded-3xl bg-card shadow-[0_2px_0_rgba(0,0,0,0.04)] ring-1 ring-border transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`${meta.cardClass} flex aspect-[4/3] items-center justify-center text-7xl`}
      >
        <span aria-hidden>{event.emoji}</span>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap gap-1.5">
          {event.categories.slice(0, 3).map((c) => (
            <span
              key={c}
              className={`${CATEGORY_META[c].chipClass} rounded-full px-2.5 py-0.5 text-xs font-semibold`}
            >
              {CATEGORY_META[c].label}
            </span>
          ))}
        </div>
        <h3 className="font-display text-xl font-extrabold leading-tight text-foreground">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground">{event.host}</p>
        <div className="flex items-center justify-between pt-1 text-sm">
          <span className={isToday(event.date) ? "font-bold text-primary" : "text-foreground"}>
            {formatWhen(event.date)}
          </span>
          <span className="text-muted-foreground">{event.rsvps} going</span>
        </div>
      </div>
    </Link>
  );
}
