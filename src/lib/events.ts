export type Category =
  | "free-food"
  | "networking"
  | "ticketed"
  | "faculty"
  | "club"
  | "career"
  | "social";

export type CampusEvent = {
  id: string;
  title: string;
  host: string;
  description: string;
  date: string; // ISO
  location: string;
  categories: Category[];
  emoji: string;
  rsvps: number;
  cost?: string;
};

export const CATEGORY_META: Record<
  Category,
  { label: string; chipClass: string; cardClass: string; icon: string }
> = {
  "free-food": {
    label: "Free Food",
    chipClass: "bg-cat-food text-cat-food-foreground",
    cardClass: "bg-cat-food",
    icon: "🍕",
  },
  networking: {
    label: "Networking",
    chipClass: "bg-cat-career text-cat-career-foreground",
    cardClass: "bg-cat-career",
    icon: "🤝",
  },
  ticketed: {
    label: "Ticketed",
    chipClass: "bg-cat-ticketed text-cat-ticketed-foreground",
    cardClass: "bg-cat-ticketed",
    icon: "🎟️",
  },
  faculty: {
    label: "Faculty",
    chipClass: "bg-cat-faculty text-cat-faculty-foreground",
    cardClass: "bg-cat-faculty",
    icon: "🎓",
  },
  club: {
    label: "Club",
    chipClass: "bg-cat-club text-cat-club-foreground",
    cardClass: "bg-cat-club",
    icon: "🎨",
  },
  career: {
    label: "Career",
    chipClass: "bg-cat-career text-cat-career-foreground",
    cardClass: "bg-cat-career",
    icon: "💼",
  },
  social: {
    label: "Social",
    chipClass: "bg-cat-social text-cat-social-foreground",
    cardClass: "bg-cat-social",
    icon: "🎉",
  },
};

export const ALL_CATEGORIES: Category[] = [
  "free-food",
  "networking",
  "ticketed",
  "faculty",
  "club",
  "career",
  "social",
];

const todayAt = (h: number, m = 0) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const daysFromNow = (n: number, h = 18) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(h, 0, 0, 0);
  return d.toISOString();
};

export const SEED_EVENTS: CampusEvent[] = [
  {
    id: "1",
    title: "Pizza & Code Night",
    host: "Computer Science Society",
    description:
      "Free pizza, free drinks, and a chill hack-along. Bring your laptop or just bring your appetite. Beginners welcome.",
    date: todayAt(18, 30),
    location: "Engineering Building, Room 204",
    categories: ["free-food", "club", "social"],
    emoji: "🍕",
    rsvps: 87,
    cost: "Free",
  },
  {
    id: "2",
    title: "Spring Career Fair",
    host: "Careers Office",
    description:
      "Meet 60+ employers across tech, finance, and consulting. Bring printed CVs. Dress smart-casual.",
    date: daysFromNow(2, 11),
    location: "Main Hall",
    categories: ["career", "networking"],
    emoji: "💼",
    rsvps: 412,
    cost: "Free",
  },
  {
    id: "3",
    title: "Business Faculty Mixer",
    host: "Business School",
    description:
      "Mingle with professors, alumni, and fellow students. Light snacks and drinks provided.",
    date: daysFromNow(1, 17),
    location: "Business Atrium",
    categories: ["faculty", "free-food", "networking"],
    emoji: "🎓",
    rsvps: 64,
    cost: "Free",
  },
  {
    id: "4",
    title: "Open Mic Night",
    host: "Music Society",
    description:
      "Sign up to perform or just come watch. Coffee bar open all night.",
    date: daysFromNow(3, 20),
    location: "Student Union Cafe",
    categories: ["social", "club"],
    emoji: "🎤",
    rsvps: 132,
    cost: "Free",
  },
  {
    id: "5",
    title: "Dance Showcase 2025",
    host: "Dance Crew",
    description:
      "Annual showcase featuring 12 student dance groups. Tickets fund next year's costumes.",
    date: daysFromNow(7, 19),
    location: "Performing Arts Theatre",
    categories: ["ticketed", "club", "social"],
    emoji: "💃",
    rsvps: 298,
    cost: "$8",
  },
  {
    id: "6",
    title: "Health Sciences Research Talk",
    host: "Faculty of Health",
    description:
      "Dr. Patel presents on campus mental health research. Q&A and refreshments after.",
    date: todayAt(15, 0),
    location: "Health Sciences Lecture Hall 1",
    categories: ["faculty", "free-food"],
    emoji: "🧪",
    rsvps: 41,
    cost: "Free",
  },
];

// In-memory store (wire to Lovable Cloud later for persistence)
let events: CampusEvent[] = [...SEED_EVENTS];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const getEvents = () => events;
export const getEvent = (id: string) => events.find((e) => e.id === id);
export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const addEvent = (e: Omit<CampusEvent, "id" | "rsvps">) => {
  const ev: CampusEvent = { ...e, id: crypto.randomUUID(), rsvps: 0 };
  events = [ev, ...events];
  notify();
  return ev;
};
export const rsvp = (id: string) => {
  events = events.map((e) => (e.id === id ? { ...e, rsvps: e.rsvps + 1 } : e));
  notify();
};

export const isToday = (iso: string) => {
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
};

export const formatWhen = (iso: string) => {
  const d = new Date(iso);
  if (isToday(iso)) {
    return `Today · ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  return d.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
