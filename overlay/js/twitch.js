/**
 * TwitchClient: WebSocket-based Twitch IRC client.
 *
 * Connects to wss://irc-ws.chat.twitch.tv and joins a channel.
 * Emits 'message' events for PRIVMSG lines.
 * Handles PING/PONG keepalive and automatic reconnection.
 */
export class TwitchClient {
  constructor({ channel, oauthToken }) {
    this.channel = channel.toLowerCase().replace(/^#/, '');
    this.oauthToken = oauthToken || '';
    // Use a random justinfan nick for anonymous access; real nick for authed.
    this.nick = this.oauthToken
      ? this.channel
      : `justinfan${Math.floor(Math.random() * 80000) + 10000}`;

    this._ws = null;
    this._handlers = {}; // event name → [callback]
    this._reconnectDelay = 1000;
    this._maxReconnectDelay = 30000;
    this._intentionalClose = false;
    this._reconnectTimer = null;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  connect() {
    this._intentionalClose = false;
    this._open();
  }

  disconnect() {
    this._intentionalClose = true;
    clearTimeout(this._reconnectTimer);
    if (this._ws) {
      this._ws.close();
      this._ws = null;
    }
    this._emit('disconnect', {});
  }

  /**
   * Register an event listener.
   * Events: 'connected', 'disconnect', 'message', 'error'
   */
  on(event, callback) {
    if (!this._handlers[event]) this._handlers[event] = [];
    this._handlers[event].push(callback);
  }

  off(event, callback) {
    if (!this._handlers[event]) return;
    this._handlers[event] = this._handlers[event].filter((cb) => cb !== callback);
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  _open() {
    try {
      this._ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    } catch (err) {
      this._emit('error', { message: `WebSocket constructor failed: ${err.message}` });
      this._scheduleReconnect();
      return;
    }

    this._ws.onopen = () => {
      this._reconnectDelay = 1000; // reset backoff on successful open
      if (this.oauthToken) {
        this._send(`PASS ${this.oauthToken}`);
      }
      this._send(`NICK ${this.nick}`);
      // Request tags capability so we get display-name metadata.
      this._send('CAP REQ :twitch.tv/tags');
      this._send(`JOIN #${this.channel}`);
      this._emit('connected', { channel: this.channel });
    };

    this._ws.onmessage = (evt) => {
      // A single WebSocket frame can contain multiple IRC lines.
      const lines = evt.data.split('\r\n');
      for (const line of lines) {
        if (line) this._handleLine(line);
      }
    };

    this._ws.onerror = (evt) => {
      this._emit('error', { message: 'WebSocket error', event: evt });
    };

    this._ws.onclose = () => {
      this._ws = null;
      this._emit('disconnect', {});
      if (!this._intentionalClose) {
        this._scheduleReconnect();
      }
    };
  }

  _send(data) {
    if (this._ws && this._ws.readyState === WebSocket.OPEN) {
      this._ws.send(data);
    }
  }

  _scheduleReconnect() {
    const delay = this._reconnectDelay;
    this._reconnectDelay = Math.min(this._reconnectDelay * 2, this._maxReconnectDelay);
    this._emit('error', { message: `Disconnected. Reconnecting in ${delay / 1000}s…` });
    this._reconnectTimer = setTimeout(() => this._open(), delay);
  }

  /**
   * Parse an IRC line and dispatch accordingly.
   *
   * Twitch IRC format (with tags):
   *   @key=val;key=val :user!user@user.tmi.twitch.tv PRIVMSG #channel :message text
   *
   * Without tags:
   *   :user!user@user.tmi.twitch.tv PRIVMSG #channel :message text
   */
  _handleLine(line) {
    // Respond to server PING to stay connected.
    if (line.startsWith('PING')) {
      this._send('PONG :tmi.twitch.tv');
      return;
    }

    let rest = line;
    let tags = {};

    // Parse @tags prefix.
    if (rest.startsWith('@')) {
      const spaceIdx = rest.indexOf(' ');
      const tagStr = rest.slice(1, spaceIdx);
      rest = rest.slice(spaceIdx + 1);
      for (const part of tagStr.split(';')) {
        const eqIdx = part.indexOf('=');
        if (eqIdx !== -1) {
          tags[part.slice(0, eqIdx)] = part.slice(eqIdx + 1);
        }
      }
    }

    // We only care about PRIVMSG lines.
    if (!rest.includes('PRIVMSG')) return;

    // Parse: :user!user@user.tmi.twitch.tv PRIVMSG #channel :text
    const match = rest.match(/^:(\w+)!\w+@\S+ PRIVMSG #\S+ :(.*)$/);
    if (!match) return;

    const rawUsername = match[1];
    const displayName = tags['display-name'] || rawUsername;
    const text = match[2];

    this._emit('message', {
      username: rawUsername.toLowerCase(),
      displayName,
      text,
    });
  }

  _emit(event, data) {
    const handlers = this._handlers[event];
    if (!handlers) return;
    for (const fn of handlers) {
      try {
        fn(data);
      } catch (err) {
        console.error(`[TwitchClient] Handler error for "${event}":`, err);
      }
    }
  }
}
