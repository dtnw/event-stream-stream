/**
 * app.js — Main orchestrator for the Twitch World Map Overlay.
 *
 * Wires together: TwitchClient → country resolver → MapManager + StatsPanel + StorageManager.
 */

import { CONFIG } from './config.js';
import { resolveCountry } from './countries.js';
import { TwitchClient } from './twitch.js';
import { MapManager } from './map.js';
import { StatsPanel } from './stats.js';
import { StorageManager } from './storage.js';

class App {
  constructor() {
    this.config = CONFIG;

    // ── DOM refs ──────────────────────────────────────────────────────────────
    this.mapContainer = document.getElementById('map-container');
    this.pinLayer = document.getElementById('pin-layer');
    this.mapImage = document.getElementById('map-image');
    this.statusDot = document.getElementById('status-dot');
    this.statusText = document.getElementById('status-text');
    this.lastCommandEl = document.getElementById('last-command');

    // Stats elements.
    const statEls = {
      totalViewers: document.getElementById('stat-total-viewers'),
      totalCountries: document.getElementById('stat-total-countries'),
      countryList: document.getElementById('stat-country-list'),
    };

    // ── Modules ───────────────────────────────────────────────────────────────
    this.storage = new StorageManager(this.config.storageKey);
    this.mapManager = new MapManager(this.mapContainer, this.pinLayer, this.config);
    this.stats = new StatsPanel(statEls, this.config);
    this.twitch = new TwitchClient({
      channel: this.config.channel,
      oauthToken: this.config.oauthToken,
    });

    /**
     * In-memory source of truth for all viewers.
     * username (lowercase) → { username, displayName, countryName, lat, lng, timestamp }
     */
    this.viewers = new Map();

    // Debounce storage writes to avoid excessive serialization.
    this._saveTimer = null;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  init() {
    this._applyConfig();
    this._restoreViewers();
    this._bindTwitch();
    this._bindUI();
    this.twitch.connect();
    this._setStatus('connecting', 'Connecting…');
  }

  // ── Config ──────────────────────────────────────────────────────────────────

  _applyConfig() {
    if (this.mapImage) {
      this.mapImage.src = this.config.mapImageUrl;
    }
  }

  // ── Persistence ─────────────────────────────────────────────────────────────

  _restoreViewers() {
    const saved = this.storage.load();
    if (saved.size === 0) return;
    this.viewers = saved;
    this.mapManager.restorePins(this.viewers);
    this.stats.rebuild(this.viewers);
  }

  _scheduleSave() {
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this.storage.save(this.viewers), 500);
  }

  // ── Twitch integration ──────────────────────────────────────────────────────

  _bindTwitch() {
    this.twitch.on('connected', ({ channel }) => {
      this._setStatus('connected', `Connected to #${channel}`);
    });

    this.twitch.on('disconnect', () => {
      this._setStatus('disconnected', 'Disconnected');
    });

    this.twitch.on('error', ({ message }) => {
      this._setStatus('error', message);
    });

    this.twitch.on('message', (msg) => this._handleMessage(msg));
  }

  /**
   * Parse and handle an incoming chat message.
   * Only processes messages starting with "!from " (case-insensitive).
   */
  _handleMessage({ username, displayName, text }) {
    const trimmed = text.trim();
    const lower = trimmed.toLowerCase();
    if (!lower.startsWith('!from ')) return;

    const input = trimmed.slice(6).trim(); // everything after "!from "
    if (!input) return;

    const country = resolveCountry(input);
    if (!country) {
      // Unrecognised country — silently ignore.
      return;
    }

    const existing = this.viewers.get(username);
    const prevCountry = existing?.countryName ?? null;
    const isNew = !existing;

    const record = {
      username,
      displayName,
      countryName: country.name,
      lat: country.lat,
      lng: country.lng,
      timestamp: Date.now(),
    };

    this.viewers.set(username, record);
    this.mapManager.addOrUpdatePin(username, displayName, country);

    if (isNew) {
      this.stats.addViewer(country.name, null);
    } else {
      this.stats.updateViewer(prevCountry, country.name);
    }

    this._updateLastCommand(displayName, country.name);
    this._scheduleSave();
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────

  _bindUI() {
    // Allow clicking the "Clear All" button to wipe saved data.
    const clearBtn = document.getElementById('btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all viewer pins? This cannot be undone.')) {
          this.viewers.clear();
          this.mapManager.clearAll();
          this.stats.rebuild(this.viewers);
          this.storage.clear();
        }
      });
    }
  }

  _setStatus(state, message) {
    if (this.statusDot) {
      this.statusDot.className = `status-dot status-${state}`;
    }
    if (this.statusText) {
      this.statusText.textContent = message;
    }
  }

  _updateLastCommand(displayName, countryName) {
    if (!this.lastCommandEl) return;
    this.lastCommandEl.textContent = `${displayName} → ${countryName}`;
    // Flash animation.
    this.lastCommandEl.classList.remove('flash');
    // Reflow trick to restart the animation.
    void this.lastCommandEl.offsetWidth;
    this.lastCommandEl.classList.add('flash');
  }
}

// ── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();

  // Expose for debug access via browser console.
  window._overlayApp = app;
});
