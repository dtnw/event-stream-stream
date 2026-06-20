# Twitch World Map Overlay — Setup Guide

A production-ready OBS Browser Source overlay that plots Twitch viewer locations on a live world map using `!from <country>` chat commands.

---

## Project Structure

```
overlay/
├── index.html          ← Entry point / OBS Browser Source target
├── css/
│   └── overlay.css     ← All styles (transparent background for OBS)
├── js/
│   ├── config.js       ← ★ EDIT THIS — channel name, OAuth, pin settings
│   ├── countries.js    ← Country database: 195 countries, coordinates, aliases
│   ├── twitch.js       ← WebSocket Twitch IRC client (auto-reconnect)
│   ├── map.js          ← Pin rendering on the world map (batched rAF)
│   ├── stats.js        ← Live statistics panel
│   ├── storage.js      ← localStorage persistence
│   └── app.js          ← Main orchestrator
└── SETUP.md            ← This file
```

---

## 1. Configure the Overlay

Open `js/config.js` and set:

```js
channel: 'your_channel_name',   // Your Twitch username (lowercase)
oauthToken: '',                  // Optional — see below
```

### OAuth Token (optional but recommended)

An OAuth token allows the overlay to authenticate with Twitch IRC, which is required for some channels (subscriber-only, followers-only chat, etc.).

**Without a token:** The overlay connects anonymously as `justinfan<random>`. This works for most public channels.

**With a token:**
1. Visit https://twitchapps.com/tmi/
2. Click **Connect** and authorise with your Twitch account.
3. Copy the token (starts with `oauth:`).
4. Paste it into `config.js`:

```js
oauthToken: 'oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
```

> ⚠️  Keep your OAuth token private. Never commit it to a public repository.

---

## 2. Viewer Commands

Viewers type in Twitch chat:

```
!from Germany
!from USA
!from South Korea
!from UK
!from New Zealand
```

- Case-insensitive: `!from germany` works the same as `!from Germany`.
- Common aliases are supported: `USA`, `UK`, `Brasil`, `Россия`, etc.
- One pin per viewer. Typing a new country moves the existing pin.
- Unrecognised country names are silently ignored.

---

## 3. OBS Browser Source Setup

1. Open OBS Studio.
2. In the **Sources** panel, click **+** → **Browser**.
3. Name it (e.g. `World Map Overlay`).
4. In the properties dialog:

| Setting | Value |
|---|---|
| **Local File** | ✓ Checked |
| **File** | Browse to `overlay/index.html` |
| **Width** | `1920` (or `2560` for 1440p) |
| **Height** | `1080` (or `1440` for 1440p) |
| **FPS** | `30` |
| **Shutdown source when not visible** | ✓ Checked |
| **Refresh browser when scene becomes active** | ✓ Checked |

5. Click **OK**.

### Positioning

The overlay is full-screen with a transparent background. Place it as the **top-most** layer in your scene. The map and stats panel will render over your gameplay/camera feed.

If you want **only the map** visible (no stats panel), you can crop the Browser Source in OBS using the **Edit Transform** dialog (right-click → Transform → Edit Transform).

---

## 4. Testing Locally

Open `overlay/index.html` directly in Google Chrome (or any modern browser):

```
file:///path/to/overlay/index.html
```

Open the browser console (F12) to see connection logs and debug the `window._overlayApp` object.

---

## 5. Clearing Viewer Data

- Click the **✕ Clear All Pins** button in the stats panel.
- Or run in the browser console: `window._overlayApp.storage.clear()`
- Or manually clear `localStorage` → key: `twitch_map_overlay_viewers`

---

## 6. Configuration Reference

```js
// js/config.js

channel: 'your_channel_name',   // Twitch channel (lowercase)
oauthToken: '',                  // oauth:xxx or '' for anonymous

mapImageUrl: '...',              // Equirectangular world map URL

pinColor: '#e63946',             // CSS colour for pins
pinSize: 8,                      // Pin circle radius in px
animationDuration: 600,          // Pin drop animation in ms
showUsernames: true,             // Show username labels on pins
maxUsernameLength: 16,           // Truncate long usernames

storageKey: 'twitch_map_overlay_viewers',  // localStorage key

renderBatchMs: 50,               // rAF batch interval (ms)
topCountriesCount: 10,           // Countries shown in stats panel
```

---

## 7. Performance Notes

| Viewers | Behaviour |
|---|---|
| 0–500   | Instant pin renders, no perceptible lag |
| 500–2 000 | rAF batching smooths DOM inserts |
| 2 000–5 000 | Batched DocumentFragment inserts; all on GPU layers |
| 5 000+ | Recommend increasing `renderBatchMs` to 100–200 |

Pins use CSS `transform` and `opacity` for all animations — these are GPU-composited and do not trigger layout recalculations.

---

## 8. Future Improvements

- **Canvas rendering mode** for > 10 000 simultaneous pins (replace SVG DOM with a 2D canvas draw loop).
- **Clustering** — group pins when many viewers share the same country.
- **Country flag emojis** on pin labels.
- **Heatmap layer** — canvas overlay showing viewer density gradients.
- **Leaderboard sounds** — audio cue when a new country is added.
- **Configurable map projections** — Mercator, Robinson, etc.
- **Custom command prefix** — configurable via `config.js` (e.g. `!location`).
- **Moderator commands** — `!mapban <user>` to remove a viewer's pin.
- **Export** — save a snapshot image of the map at stream end.
- **Channel Points redemption** — trigger `!from` via Channel Point reward.
