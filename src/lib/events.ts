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
  date: string; // ISO start
  endDate?: string; // ISO end (optional, used for "live now" detection)
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

const at = (year: number, month: number, day: number, h: number, m = 0) => {
  const d = new Date(year, month - 1, day, h, m, 0, 0);
  return d.toISOString();
};

export const SEED_EVENTS: CampusEvent[] = [
  {
    id: "inspofest",
    title: "Deakin InspoFest with HEX & ML.AI",
    host: "HEX × ML.AI",
    description:
      "An evening of inspiration, demos, and community with HEX and ML.AI. Talks, hands-on showcases, and free food. Open to all Deakin students.",
    date: at(2026, 4, 17, 17, 0),
    endDate: at(2026, 4, 17, 20, 0),
    location: "Burwood Campus",
    categories: ["club", "free-food", "networking", "social"],
    emoji: "✨",
    rsvps: 184,
    cost: "Free",
  },
  {
    id: "inspofest-pitch",
    title: "InspoFest Pitch Day with HEX",
    host: "HEX",
    description:
      "Student teams pitch their InspoFest projects to a panel of judges and the HEX community. Come watch, vote, and cheer the next big idea on.",
    date: at(2026, 4, 24, 13, 0),
    endDate: at(2026, 4, 24, 17, 0),
    location: "Burwood Campus · HEX Studio",
    categories: ["club", "career", "networking", "social"],
    emoji: "🎤",
    rsvps: 96,
    cost: "Free",
  },
  {
    id: "dusa-breakfast",
    title: "DUSA Free Breakfast",
    host: "DUSA Advocacy",
    description:
      "DUSA's Advocacy Free Breakfast is back! Drop in at Burwood, Waurn Ponds or Waterfront for a free start to your day.",
    date: at(2026, 4, 22, 9, 0),
    endDate: at(2026, 4, 22, 11, 0),
    location: "Burwood · Waurn Ponds · Waterfront",
    categories: ["free-food", "social", "club"],
    emoji: "🥞",
    rsvps: 322,
    cost: "Free",
  },
  {
    id: "dusa-pantry",
    title: "DUSA Food Pantry",
    host: "DUSA",
    description:
      "Bring a bag and collect fresh fruit, vegetables and pantry items. Available across Burwood, Waterfront and Waurn Ponds on rotating days.",
    date: at(2026, 4, 29, 11, 0),
    endDate: at(2026, 4, 29, 13, 0),
    location: "Burwood · Waterfront · Waurn Ponds",
    categories: ["free-food", "faculty"],
    emoji: "🥦",
    rsvps: 214,
    cost: "Free",
  },
  {
    id: "chillout-burwood",
    title: "DUSA Chill Out Trolley — Burwood",
    host: "DUSA",
    description:
      "Burwood students — get your FREE snack and drink fix in the Burwood Library on Level 2! Every Tuesday during T1.",
    date: at(2026, 4, 21, 17, 0),
    endDate: at(2026, 4, 21, 18, 0),
    location: "Burwood Library, Level 2",
    categories: ["free-food", "social", "club"],
    emoji: "🥤",
    rsvps: 154,
    cost: "Free",
  },
  {
    id: "chillout-geelong",
    title: "DUSA Chill Out Trolley — Geelong",
    host: "DUSA",
    description:
      "Geelong students — get your FREE snack and drink fix in the Waterfront & Waurn Ponds Library! Every Thursday during T1.",
    date: at(2026, 4, 23, 17, 0),
    endDate: at(2026, 4, 23, 18, 0),
    location: "Waterfront · Waurn Ponds Library",
    categories: ["free-food", "social"],
    emoji: "🍪",
    rsvps: 112,
    cost: "Free",
  },
  {
    id: "therapy-dog",
    title: "Therapy Dog Program with Meya",
    host: "Deakin Wellbeing",
    description:
      "Take a moment to relax and meet Meya the Therapy Dog. A calm break between classes — every Tuesday across Burwood and Waurn Ponds.",
    date: at(2026, 4, 28, 10, 0),
    endDate: at(2026, 4, 28, 13, 0),
    location: "Burwood · Waurn Ponds",
    categories: ["social", "faculty"],
    emoji: "🐶",
    rsvps: 240,
    cost: "Free",
  },
  {
    id: "barista-course",
    title: "Barista Coffee Course & RSF",
    host: "DUSA Skills",
    description:
      "Beginners course for entering the hospitality industry. Learn the fundamentals of making coffee, latte art, and earn your Responsible Food Handler certificate.",
    date: at(2026, 5, 2, 9, 0),
    endDate: at(2026, 5, 2, 16, 30),
    location: "Melbourne CBD",
    categories: ["career", "ticketed", "networking"],
    emoji: "☕",
    rsvps: 58,
    cost: "Ticketed",
  },
  {
    id: "first-aid-burwood",
    title: "Level 1 First Aid — Burwood",
    host: "DUSA Skills",
    description:
      "Get qualified in Level 1 First Aid in a single day. Hands-on training with certified instructors, certificate issued on completion.",
    date: at(2026, 5, 7, 9, 0),
    endDate: at(2026, 5, 7, 16, 0),
    location: "Burwood Campus",
    categories: ["career", "ticketed", "faculty"],
    emoji: "🩹",
    rsvps: 42,
    cost: "Ticketed",
  },
  {
    id: "career-fair",
    title: "T1 Careers Mixer",
    host: "Deakin Careers",
    description:
      "Meet 40+ employers across tech, health, and finance. Bring printed CVs, drinks and snacks provided.",
    date: at(2026, 5, 14, 16, 0),
    endDate: at(2026, 5, 14, 19, 0),
    location: "Burwood — Building LB",
    categories: ["career", "networking", "free-food"],
    emoji: "💼",
    rsvps: 287,
    cost: "Free",
  },
];

export const isLiveNow = (e: CampusEvent, now: Date = new Date()) => {
  const start = new Date(e.date).getTime();
  const end = e.endDate ? new Date(e.endDate).getTime() : start + 2 * 60 * 60 * 1000;
  const t = now.getTime();
  return t >= start && t <= end;
};

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
