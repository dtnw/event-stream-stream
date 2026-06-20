/**
 * Central configuration for the Twitch World Map Overlay.
 * Edit these values before loading as an OBS Browser Source.
 */
export const CONFIG = {
  // ── Twitch ────────────────────────────────────────────────────────────────
  /** Your Twitch channel name (lowercase). */
  channel: 'your_channel_name',

  /**
   * Optional OAuth token for authenticated read access.
   * Format: "oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   * Leave empty ('') for anonymous read-only access (works on most public channels).
   * Generate at: https://twitchapps.com/tmi/
   */
  oauthToken: '',

  // ── Map ───────────────────────────────────────────────────────────────────
  /**
   * URL to the world map image.
   * Must use equirectangular (plate carrée) projection for accurate pin placement.
   * Default: Natural Earth style from Wikimedia Commons.
   */
  mapImageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2560px-World_map_-_low_resolution.svg.png',

  // ── Pins ──────────────────────────────────────────────────────────────────
  /** CSS colour for the pin marker (any valid CSS colour). */
  pinColor: '#e63946',

  /** Base radius of the pin circle in pixels. */
  pinSize: 8,

  /** Duration of the pin drop animation in milliseconds. */
  animationDuration: 600,

  /** Whether to show usernames next to pins. */
  showUsernames: true,

  /** Maximum number of username characters shown on the label. */
  maxUsernameLength: 16,

  // ── Storage ───────────────────────────────────────────────────────────────
  /** localStorage key used to persist viewer data. */
  storageKey: 'twitch_map_overlay_viewers',

  // ── Performance ───────────────────────────────────────────────────────────
  /** Batch DOM updates every N milliseconds for high-volume streams. */
  renderBatchMs: 50,

  // ── Statistics panel ─────────────────────────────────────────────────────
  /** Number of top countries shown in the stats panel. */
  topCountriesCount: 10,
};
