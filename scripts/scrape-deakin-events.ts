/**
 * Scrapes student events from the Deakin events page and prints a
 * SEED_EVENTS array you can paste into src/lib/events.ts.
 *
 * Run with:  bun scripts/scrape-deakin-events.ts
 *
 * Requires the `playwright` package:
 *   bun add -d playwright
 *   bunx playwright install chromium
 */

import { chromium } from "playwright";

const URL =
  "https://www.deakin.edu.au/students/student-life-and-services/student-events";

type Category =
  | "free-food"
  | "networking"
  | "ticketed"
  | "faculty"
  | "club"
  | "career"
  | "social"
  | "online";

interface ScrapedEvent {
  title: string;
  host: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  categories: Category[];
  emoji: string;
  cost?: string;
}

function guessCategories(text: string): Category[] {
  const t = text.toLowerCase();
  const cats: Category[] = [];
  if (/food|lunch|breakfast|dinner|catering|snack|pizza|free food/i.test(t)) cats.push("free-food");
  if (/network|mixer|connect|industry|professional/i.test(t)) cats.push("networking");
  if (/ticket|paid|\$[1-9]/i.test(t)) cats.push("ticketed");
  if (/faculty|school of|college of|academic|research|lecture/i.test(t)) cats.push("faculty");
  if (/club|society|association|guild/i.test(t)) cats.push("club");
  if (/career|job|employ|intern|cv|resume|workshop/i.test(t)) cats.push("career");
  if (/social|party|celebration|meet|fun|games/i.test(t)) cats.push("social");
  if (/online|virtual|zoom|teams|webinar|remote/i.test(t)) cats.push("online");
  return cats.length ? cats : ["social"];
}

function guessEmoji(title: string, cats: Category[]): string {
  const t = title.toLowerCase();
  if (/dog|pet|animal/i.test(t)) return "🐶";
  if (/coffee|barista/i.test(t)) return "☕";
  if (/food|breakfast|lunch|dinner|pizza/i.test(t)) return "🍕";
  if (/career|job|employ/i.test(t)) return "💼";
  if (/first aid|health|wellbeing|mental/i.test(t)) return "🩺";
  if (/music|concert|band/i.test(t)) return "🎵";
  if (/art|paint|draw/i.test(t)) return "🎨";
  if (/sport|gym|run|fitness/i.test(t)) return "🏃";
  if (/ai|tech|hack|code|software/i.test(t)) return "🤖";
  if (/library|book|research/i.test(t)) return "📚";
  if (cats.includes("ticketed")) return "🎟️";
  if (cats.includes("networking")) return "🤝";
  if (cats.includes("club")) return "🎉";
  if (cats.includes("faculty")) return "🎓";
  if (cats.includes("online")) return "💻";
  return "✨";
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

async function scrape(): Promise<ScrapedEvent[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.error("Navigating to Deakin events page…");
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30_000 });

  // Scroll to trigger any lazy-loaded content
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  const events = await page.evaluate(() => {
    const results: Array<{
      title: string;
      description: string;
      date: string;
      location: string;
      cost: string;
      url: string;
    }> = [];

    // Try common CMS patterns for event cards
    const selectors = [
      ".event-card",
      ".event-item",
      ".event-listing",
      "[class*='event']",
      "article",
      ".card",
      ".listing-item",
    ];

    for (const sel of selectors) {
      const cards = document.querySelectorAll(sel);
      if (cards.length < 2) continue;

      cards.forEach((card) => {
        const title =
          card.querySelector("h2, h3, h4, .title, [class*='title']")
            ?.textContent?.trim() ?? "";
        if (!title || title.length < 3) return;

        const description =
          card.querySelector("p, .description, [class*='desc'], .summary")
            ?.textContent?.trim() ?? "";

        const dateEl = card.querySelector(
          "time, .date, [class*='date'], [datetime]",
        );
        const date =
          dateEl?.getAttribute("datetime") ??
          dateEl?.textContent?.trim() ??
          "";

        const location =
          card.querySelector(".location, [class*='location'], .venue, [class*='venue']")
            ?.textContent?.trim() ?? "";

        const cost =
          card.querySelector(".cost, .price, [class*='cost'], [class*='price']")
            ?.textContent?.trim() ?? "";

        const linkEl = card.querySelector("a[href]");
        const url = linkEl?.getAttribute("href") ?? "";

        results.push({ title, description, date, location, cost, url });
      });

      if (results.length) break;
    }

    // Fallback: grab all headings with nearby time elements
    if (!results.length) {
      document.querySelectorAll("h2, h3").forEach((h) => {
        const title = h.textContent?.trim() ?? "";
        if (title.length < 5 || title.length > 120) return;
        const parent = h.closest("section, article, div") ?? h.parentElement;
        const dateEl = parent?.querySelector("time, [class*='date']");
        const date = dateEl?.getAttribute("datetime") ?? dateEl?.textContent?.trim() ?? "";
        const description = parent?.querySelector("p")?.textContent?.trim() ?? "";
        const url = (h.closest("a") ?? parent?.querySelector("a"))?.getAttribute("href") ?? "";
        results.push({ title, description, date, location: "", cost: "", url });
      });
    }

    return results;
  });

  await browser.close();

  return events.map((e) => {
    const cats = guessCategories(`${e.title} ${e.description} ${e.cost}`);
    const emoji = guessEmoji(e.title, cats);

    // Try to parse the date string into ISO
    let iso = "";
    try {
      const d = new Date(e.date);
      if (!isNaN(d.getTime())) iso = d.toISOString();
    } catch {
      iso = "";
    }
    if (!iso) {
      // Default to one week from now if we couldn't parse
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 7);
      iso = fallback.toISOString();
    }

    return {
      title: e.title,
      host: "Deakin University",
      description: e.description || e.title,
      date: iso,
      location: e.location || "Deakin Campus",
      categories: cats,
      emoji,
      cost: e.cost || "Free",
    } satisfies ScrapedEvent;
  });
}

async function main() {
  let events: ScrapedEvent[];
  try {
    events = await scrape();
  } catch (err) {
    console.error("Scrape failed:", err);
    process.exit(1);
  }

  if (!events.length) {
    console.error(
      "No events found. The page structure may have changed — inspect the page and update the selectors in this script.",
    );
    process.exit(1);
  }

  console.error(`Found ${events.length} events. Generating SEED_EVENTS…\n`);

  // Print the SEED_EVENTS array to stdout so you can pipe it or copy-paste
  const lines = events.map((e, i) => {
    const id = slugify(e.title) || `event-${i}`;
    return `  {
    id: ${JSON.stringify(id)},
    title: ${JSON.stringify(e.title)},
    host: ${JSON.stringify(e.host)},
    description: ${JSON.stringify(e.description)},
    date: ${JSON.stringify(e.date)},${e.endDate ? `\n    endDate: ${JSON.stringify(e.endDate)},` : ""}
    location: ${JSON.stringify(e.location)},
    categories: ${JSON.stringify(e.categories)},
    emoji: ${JSON.stringify(e.emoji)},
    rsvps: 0,
    interested: 0,${e.cost ? `\n    cost: ${JSON.stringify(e.cost)},` : ""}
  }`;
  });

  console.log("export const SEED_EVENTS: CampusEvent[] = [");
  console.log(lines.join(",\n"));
  console.log("];");
}

main();
