import { useSyncExternalStore } from "react";
import { getEvents, subscribe } from "@/lib/events";

export function useEvents() {
  return useSyncExternalStore(
    (l) => {
      const unsub = subscribe(l);
      return () => {
        unsub();
      };
    },
    getEvents,
    getEvents,
  );
}
