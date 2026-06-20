/**
 * StatsPanel: live statistics sidebar showing viewer and country counts.
 * Updates are throttled to avoid DOM churn on high-volume streams.
 */
export class StatsPanel {
  /**
   * @param {object} elements - { totalViewers, totalCountries, countryList }
   * @param {object} config   - Overlay CONFIG object.
   */
  constructor(elements, config) {
    this.els = elements;
    this.config = config;
    this._dirty = false;
    this._rafId = null;
    /** country name → viewer count */
    this._countryCounts = new Map();
    this._totalViewers = 0;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Rebuild stats from a full viewer Map.
   * Efficient O(n) scan; triggers a throttled render.
   */
  rebuild(viewersMap) {
    this._countryCounts.clear();
    this._totalViewers = viewersMap.size;
    for (const viewer of viewersMap.values()) {
      const key = viewer.countryName;
      this._countryCounts.set(key, (this._countryCounts.get(key) ?? 0) + 1);
    }
    this._scheduleRender();
  }

  /** Increment count for one country (fast path on new !from command). */
  addViewer(countryName, prevCountryName) {
    this._totalViewers++;
    if (prevCountryName) {
      // Viewer changed country — decrement old, increment new.
      const prev = (this._countryCounts.get(prevCountryName) ?? 1) - 1;
      if (prev <= 0) this._countryCounts.delete(prevCountryName);
      else this._countryCounts.set(prevCountryName, prev);
    }
    this._countryCounts.set(countryName, (this._countryCounts.get(countryName) ?? 0) + 1);
    this._scheduleRender();
  }

  /** Update total viewer count without touching country data. */
  updateViewer(oldCountryName, newCountryName) {
    // Pin moved — only country reassignment, total stays same.
    if (oldCountryName !== newCountryName) {
      const prev = (this._countryCounts.get(oldCountryName) ?? 1) - 1;
      if (prev <= 0) this._countryCounts.delete(oldCountryName);
      else this._countryCounts.set(oldCountryName, prev);
      this._countryCounts.set(newCountryName, (this._countryCounts.get(newCountryName) ?? 0) + 1);
    }
    this._scheduleRender();
  }

  // ── Rendering ───────────────────────────────────────────────────────────────

  _scheduleRender() {
    this._dirty = true;
    if (!this._rafId) {
      this._rafId = requestAnimationFrame(() => {
        this._rafId = null;
        if (this._dirty) this._render();
        this._dirty = false;
      });
    }
  }

  _render() {
    const { totalViewers, totalCountries, countryList } = this.els;
    const { topCountriesCount } = this.config;

    if (totalViewers) totalViewers.textContent = this._totalViewers.toLocaleString();
    if (totalCountries) totalCountries.textContent = this._countryCounts.size.toLocaleString();

    if (!countryList) return;

    // Sort countries descending by viewer count; take top N.
    const sorted = Array.from(this._countryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topCountriesCount);

    const maxCount = sorted[0]?.[1] ?? 1;

    // Build list via innerHTML on a temp fragment — avoids repeated reflows.
    const rows = sorted
      .map(([name, count], idx) => {
        const pct = Math.round((count / maxCount) * 100);
        const rank = idx + 1;
        return `
          <li class="stat-country-row">
            <span class="stat-rank">${rank}</span>
            <span class="stat-name">${_esc(name)}</span>
            <span class="stat-bar-wrap">
              <span class="stat-bar" style="width:${pct}%"></span>
            </span>
            <span class="stat-count">${count}</span>
          </li>`;
      })
      .join('');

    countryList.innerHTML = rows;
  }
}

/** Minimal HTML escape to prevent XSS in country names. */
function _esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
