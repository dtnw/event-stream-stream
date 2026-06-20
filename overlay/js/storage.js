/**
 * StorageManager: persist viewer data to localStorage.
 * Viewer record shape: { username, countryName, lat, lng, timestamp }
 */
export class StorageManager {
  constructor(storageKey) {
    this.key = storageKey;
  }

  /** Load all saved viewers. Returns Map<username, viewerRecord>. */
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return new Map();
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return new Map();
      const map = new Map();
      for (const entry of arr) {
        if (entry && entry.username) {
          map.set(entry.username.toLowerCase(), entry);
        }
      }
      return map;
    } catch {
      return new Map();
    }
  }

  /** Persist the entire viewers Map to localStorage. */
  save(viewersMap) {
    try {
      const arr = Array.from(viewersMap.values());
      localStorage.setItem(this.key, JSON.stringify(arr));
    } catch {
      // Storage quota exceeded — silently continue.
    }
  }

  /** Remove all saved data. */
  clear() {
    localStorage.removeItem(this.key);
  }
}
