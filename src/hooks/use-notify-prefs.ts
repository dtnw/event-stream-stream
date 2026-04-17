import { useEffect, useState } from "react";
import type { Category } from "@/lib/events";

const KEY = "loc:notify-prefs:v1";

export function useNotifyPrefs() {
  const [prefs, setPrefs] = useState<Set<Category>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs(new Set(JSON.parse(raw) as Category[]));
    } catch {
      // ignore
    }
  }, []);

  const toggle = (c: Category) => {
    setPrefs((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      try {
        localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return { prefs, toggle };
}
