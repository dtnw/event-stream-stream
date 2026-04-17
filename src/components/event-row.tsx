import { Link } from "@tanstack/react-router";
import { CATEGORY_META, isLiveNow, type CampusEvent } from "@/lib/events";

const timeFmt = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function EventRow({ event }: { event: CampusEvent }) {
  const primary = event.categories[0] ?? "social";
  const meta = CATEGORY_META[primary];
  const live = isLiveNow(event);

  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: event.id }}
      className={`group relative flex items-start gap-3 rounded-2xl bg-card p-3 ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${
        live
          ? "ring-2 ring-destructive shadow-[0_0_0_4px_color-mix(in_oklab,var(--destructive)_15%,transparent)]"
          : "ring-border"
      }`}
    >
      <div
        className={`${meta.cardClass} relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl`}
      >
        <span aria-hidden>{event.emoji}</span>
        {live && (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-destructive ring-2 ring-card" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {live && (
          <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-destructive-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Live now
          </span>
        )}
        <p className="truncate font-display text-sm font-extrabold leading-tight text-foreground">
          {event.title}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <span>{timeFmt(event.date)}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{event.host}</span>
        </p>
        {/* All tags */}
        <div className="mt-1.5 flex flex-wrap gap-1">
          {event.categories.map((c) => (
            <span
              key={c}
              className={`${CATEGORY_META[c].chipClass} rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide`}
            >
              {CATEGORY_META[c].icon} {CATEGORY_META[c].label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 self-center text-right">
        {live ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-destructive">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
            </span>
            31 here
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-muted-foreground">
            {event.rsvps} going
          </span>
        )}
      </div>
    </Link>
  );
}
