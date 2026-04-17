import { Link } from "@tanstack/react-router";
import { CATEGORY_META, type CampusEvent } from "@/lib/events";

const timeFmt = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function EventRow({ event }: { event: CampusEvent }) {
  const primary = event.categories[0] ?? "social";
  const meta = CATEGORY_META[primary];
  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: event.id }}
      className="group flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className={`${meta.cardClass} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl`}
      >
        <span aria-hidden>{event.emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-display text-sm font-extrabold text-foreground">
            {event.title}
          </p>
        </div>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <span>{timeFmt(event.date)}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{event.host}</span>
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`${meta.chipClass} rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide`}
        >
          {meta.label}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {event.rsvps} going
        </span>
      </div>
    </Link>
  );
}
