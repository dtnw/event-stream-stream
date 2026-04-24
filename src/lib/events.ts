export type Category =
  | "free-food"
  | "networking"
  | "social"
  | "sebe"
  | "arts-ed"
  | "bus-law"
  | "health"
  | "club"
  | "online";

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
  interested?: number;
  limitedSpots?: boolean;
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
  social: {
    label: "Social",
    chipClass: "bg-cat-social text-cat-social-foreground",
    cardClass: "bg-cat-social",
    icon: "🎉",
  },
  sebe: {
    label: "SEBE",
    chipClass: "bg-cat-faculty text-cat-faculty-foreground",
    cardClass: "bg-cat-faculty",
    icon: "🔬",
  },
  "arts-ed": {
    label: "Arts & Ed",
    chipClass: "bg-cat-ticketed text-cat-ticketed-foreground",
    cardClass: "bg-cat-ticketed",
    icon: "🎨",
  },
  "bus-law": {
    label: "Bus & Law",
    chipClass: "bg-cat-club text-cat-club-foreground",
    cardClass: "bg-cat-club",
    icon: "📊",
  },
  health: {
    label: "Health",
    chipClass: "bg-accent-green text-accent-green-foreground",
    cardClass: "bg-accent-green-soft",
    icon: "🩺",
  },
  club: {
    label: "Club",
    chipClass: "bg-primary text-primary-foreground",
    cardClass: "bg-primary",
    icon: "🎭",
  },
  online: {
    label: "Online",
    chipClass: "bg-accent-green-soft text-accent-green-foreground",
    cardClass: "bg-accent-green-soft",
    icon: "💻",
  },
};

export const ALL_CATEGORIES: Category[] = [
  "free-food",
  "networking",
  "social",
  "sebe",
  "arts-ed",
  "bus-law",
  "health",
  "club",
  "online",
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
    interested: 92,
    cost: "Free",
  },
  {
    id: "inspofest-pitch",
    title: "InspoFest Pitch Day with HEX",
    host: "HEX",
    description:
      "Student teams pitch their InspoFest projects to a panel of judges and the HEX community. Come watch, vote, and cheer the next big idea on.",
    date: at(2026, 4, 24, 17, 0),
    endDate: at(2026, 4, 24, 20, 0),
    location: "Burwood Campus · HEX Studio",
    categories: ["club", "sebe", "networking", "social"],
    emoji: "🎤",
    rsvps: 21,
    interested: 38,
    limitedSpots: true,
    cost: "Free",
  },
  {
    id: "lib-advanced-lit",
    title: "Advanced Literature Searching",
    host: "Deakin Library",
    description:
      "An online library workshop for students writing literature reviews. Learn advanced database search techniques, Boolean logic, and citation tracking. Bring a research topic.",
    date: at(2026, 4, 22, 10, 0),
    endDate: at(2026, 4, 22, 11, 30),
    location: "Online (Zoom)",
    categories: ["online", "arts-ed"],
    emoji: "📚",
    rsvps: 38,
    interested: 47,
    cost: "Free",
  },
  {
    id: "ai-for-it",
    title: "AI Learning Lab for IT Students",
    host: "Faculty of SEBE — School of IT",
    description:
      "Hands-on workshop for IT students: build and deploy a small LLM-powered app using modern AI tooling. Bring your laptop. Pizza provided after the build session.",
    date: at(2026, 4, 30, 16, 0),
    endDate: at(2026, 4, 30, 19, 0),
    location: "Burwood — Building T, Room T2.05",
    categories: ["sebe", "free-food", "club"],
    emoji: "🤖",
    rsvps: 73,
    interested: 121,
    limitedSpots: true,
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
    interested: 198,
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
    categories: ["free-food"],
    emoji: "🥦",
    rsvps: 214,
    interested: 88,
    cost: "Free",
  },
  {
    id: "business-faculty-mixer",
    title: "Deakin Business School Industry Mixer",
    host: "Faculty of Business & Law",
    description:
      "Meet partners from Big 4 consulting, banking, and Melbourne startups. Q&A panel with alumni, then drinks and canapés. Smart-casual dress.",
    date: at(2026, 5, 6, 17, 30),
    endDate: at(2026, 5, 6, 19, 30),
    location: "Burwood — Deakin Business School Atrium",
    categories: ["bus-law", "networking", "free-food"],
    emoji: "📊",
    rsvps: 138,
    interested: 207,
    limitedSpots: true,
    cost: "Free",
  },
  {
    id: "health-faculty-research",
    title: "Health Faculty Research Showcase",
    host: "Faculty of Health",
    description:
      "Hear from Deakin researchers on the future of mental health, nutrition, and exercise science. Refreshments and a poster session after the talks.",
    date: at(2026, 5, 12, 15, 0),
    endDate: at(2026, 5, 12, 17, 30),
    location: "Waurn Ponds — Health & Bio Building",
    categories: ["health", "free-food", "networking"],
    emoji: "🩺",
    rsvps: 64,
    interested: 113,
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
    categories: ["social", "health"],
    emoji: "🐶",
    rsvps: 240,
    interested: 312,
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
    categories: ["networking", "social"],
    emoji: "☕",
    rsvps: 58,
    interested: 142,
    limitedSpots: true,
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
    categories: ["health", "networking"],
    emoji: "🩹",
    rsvps: 42,
    interested: 96,
    limitedSpots: true,
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
    categories: ["networking", "free-food", "sebe"],
    emoji: "💼",
    rsvps: 287,
    interested: 188,
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
export const toggleInterested = (id: string, on: boolean) => {
  events = events.map((e) =>
    e.id === id
      ? { ...e, interested: Math.max(0, (e.interested ?? 0) + (on ? 1 : -1)) }
      : e,
  );
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
