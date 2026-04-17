import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  ALL_CATEGORIES,
  CATEGORY_META,
  addEvent,
  type Category,
} from "@/lib/events";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "Post an event · campuslive" },
      {
        name: "description",
        content: "Add your campus event to the unified student feed.",
      },
    ],
  }),
});

function Admin() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [host, setHost] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [cost, setCost] = useState("Free");
  const [cats, setCats] = useState<Set<Category>>(new Set(["social"]));

  const toggleCat = (c: Category) => {
    const next = new Set(cats);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    setCats(next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !host || !date || !location) return;
    const ev = addEvent({
      title,
      host,
      description,
      date: new Date(date).toISOString(),
      location,
      emoji,
      cost,
      categories: Array.from(cats),
    });
    navigate({ to: "/events/$eventId", params: { eventId: ev.id } });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-4xl font-black text-primary">
          Post an event
        </h1>
        <p className="mt-2 text-muted-foreground">
          Get your event in front of students who actually want to see it.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field label="Event title">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pizza & Code Night"
              className="input"
            />
          </Field>

          <Field label="Hosted by">
            <input
              required
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Your club, society, or department"
              className="input"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date & time">
              <input
                required
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Location">
              <input
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Building, room"
                className="input"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr,2fr]">
            <Field label="Emoji">
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
                className="input text-center text-2xl"
              />
            </Field>
            <Field label="Cost">
              <input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Free, $5, etc."
                className="input"
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What's the vibe? Who should come? What's provided?"
              className="input resize-y"
            />
          </Field>

          <div>
            <p className="mb-2 text-sm font-bold">Categories</p>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((c) => {
                const active = cats.has(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCat(c)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-card ring-1 ring-border hover:bg-muted"
                    }`}
                  >
                    <span>{CATEGORY_META[c].icon}</span>
                    <span>{CATEGORY_META[c].label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="rounded-full bg-cta px-8 py-3 font-bold text-cta-foreground shadow-sm transition hover:brightness-95"
            >
              Publish event →
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.875rem;
          background: var(--card);
          border: 1px solid var(--border);
          padding: 0.7rem 1rem;
          font: inherit;
          color: var(--foreground);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 20%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
