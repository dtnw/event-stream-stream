/**
 * MapManager: renders and manages viewer pins on the world map.
 *
 * Uses equirectangular (plate carrée) projection:
 *   x% = (lng + 180) / 360 * 100
 *   y% = (90  - lat) / 180 * 100
 *
 * Pins are positioned with CSS left/top percentages so they scale
 * with any container size.
 *
 * For 5 000+ viewers, DOM mutations are batched via requestAnimationFrame
 * and a micro-queue to avoid layout thrashing.
 */
export class MapManager {
  /**
   * @param {HTMLElement} mapContainer  - Element that wraps the map image.
   * @param {HTMLElement} pinLayer      - Absolutely-positioned overlay for pins.
   * @param {object}      config        - Overlay CONFIG object.
   */
  constructor(mapContainer, pinLayer, config) {
    this.mapContainer = mapContainer;
    this.pinLayer = pinLayer;
    this.config = config;

    /** username (lowercase) → { element, data } */
    this._pins = new Map();

    /** Queue of pending pin operations to batch into one rAF flush. */
    this._queue = [];
    this._rafPending = false;
    this._lastFlush = 0;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Add a new pin or move an existing one.
   * @param {string} username     - Lowercase Twitch username.
   * @param {string} displayName  - Display name shown on label.
   * @param {object} country      - { name, lat, lng } from countries.js
   */
  addOrUpdatePin(username, displayName, country) {
    this._enqueue({ type: 'upsert', username, displayName, country });
  }

  /** Remove a specific viewer's pin. */
  removePin(username) {
    this._enqueue({ type: 'remove', username });
  }

  /** Remove all pins from the map. */
  clearAll() {
    for (const { element } of this._pins.values()) {
      element.remove();
    }
    this._pins.clear();
    this._queue = [];
  }

  /** Restore a batch of viewer records on page load (skips animation). */
  restorePins(viewersMap) {
    for (const viewer of viewersMap.values()) {
      this._applyUpsert(
        {
          username: viewer.username,
          displayName: viewer.displayName || viewer.username,
          country: { name: viewer.countryName, lat: viewer.lat, lng: viewer.lng },
        },
        false /* no animation */,
      );
    }
  }

  // ── Coordinate math ─────────────────────────────────────────────────────────

  _latLngToPercent(lat, lng) {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  }

  // ── Batched rendering ───────────────────────────────────────────────────────

  _enqueue(op) {
    this._queue.push(op);
    if (!this._rafPending) {
      this._rafPending = true;
      requestAnimationFrame(() => this._flush());
    }
  }

  _flush() {
    this._rafPending = false;
    const ops = this._queue.splice(0);
    // Use a DocumentFragment for multiple new pins in one batch.
    const fragment = document.createDocumentFragment();

    for (const op of ops) {
      if (op.type === 'upsert') {
        this._applyUpsert(op, true, fragment);
      } else if (op.type === 'remove') {
        this._applyRemove(op.username);
      }
    }

    if (fragment.childNodes.length > 0) {
      this.pinLayer.appendChild(fragment);
    }
  }

  _applyUpsert({ username, displayName, country }, animate, fragment) {
    const { x, y } = this._latLngToPercent(country.lat, country.lng);
    const existing = this._pins.get(username);

    if (existing) {
      // Move the existing pin.
      existing.element.style.left = `${x}%`;
      existing.element.style.top = `${y}%`;
      const label = existing.element.querySelector('.pin-label');
      if (label) {
        label.textContent = this._truncate(displayName);
      }
      existing.data.countryName = country.name;
      existing.data.lat = country.lat;
      existing.data.lng = country.lng;
    } else {
      // Create a new pin element.
      const el = this._createElement(username, displayName, x, y, animate);
      this._pins.set(username, {
        element: el,
        data: { username, displayName, countryName: country.name, lat: country.lat, lng: country.lng },
      });
      if (fragment) {
        fragment.appendChild(el);
      } else {
        this.pinLayer.appendChild(el);
      }
    }
  }

  _applyRemove(username) {
    const existing = this._pins.get(username);
    if (existing) {
      existing.element.remove();
      this._pins.delete(username);
    }
  }

  // ── DOM element creation ────────────────────────────────────────────────────

  _createElement(username, displayName, xPct, yPct, animate) {
    const { pinColor, pinSize, animationDuration, showUsernames } = this.config;

    const wrapper = document.createElement('div');
    wrapper.className = 'pin-wrapper';
    wrapper.dataset.username = username;
    wrapper.style.cssText = `
      position: absolute;
      left: ${xPct}%;
      top: ${yPct}%;
      transform: translate(-50%, -100%);
      pointer-events: none;
      z-index: 10;
    `;

    // Animated entrance class triggers the CSS keyframe.
    if (animate) {
      wrapper.classList.add('pin-drop');
      wrapper.style.setProperty('--anim-duration', `${animationDuration}ms`);
    }

    // ── Marker (pin head + needle) ──
    const marker = document.createElement('div');
    marker.className = 'pin-marker';
    marker.style.cssText = `
      width: ${pinSize * 2}px;
      height: ${pinSize * 2}px;
      background: ${pinColor};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      border: 2px solid rgba(255,255,255,0.8);
    `;

    // ── Pulse ring ──
    const pulse = document.createElement('div');
    pulse.className = 'pin-pulse';
    pulse.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${pinSize * 2}px;
      height: ${pinSize * 2}px;
      border-radius: 50%;
      border: 2px solid ${pinColor};
      animation: pin-pulse-ring 2s ease-out infinite;
      opacity: 0;
    `;

    marker.appendChild(pulse);
    wrapper.appendChild(marker);

    // ── Username label ──
    if (showUsernames) {
      const label = document.createElement('span');
      label.className = 'pin-label';
      label.textContent = this._truncate(displayName);
      label.style.cssText = `
        position: absolute;
        left: 50%;
        bottom: calc(100% + 4px);
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 10px;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.6);
        pointer-events: none;
        letter-spacing: 0.02em;
      `;
      wrapper.appendChild(label);
    }

    return wrapper;
  }

  _truncate(name) {
    const max = this.config.maxUsernameLength;
    return name.length > max ? `${name.slice(0, max)}…` : name;
  }

  // ── Accessors ───────────────────────────────────────────────────────────────

  get pinCount() {
    return this._pins.size;
  }

  getPinData(username) {
    return this._pins.get(username)?.data ?? null;
  }

  /** Iterate all pin data objects. */
  allPinData() {
    return Array.from(this._pins.values()).map((p) => p.data);
  }
}
