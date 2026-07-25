// ../../packages/protocol/dist/version.js
var PROVIDER_GLOBAL = "claude";

// ../../packages/protocol/dist/storage.js
var STORAGE_KEY_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
function isValidStorageKey(key) {
  return typeof key === "string" && STORAGE_KEY_RE.test(key);
}

// ../../packages/protocol/dist/errors.js
var BYOPErrorCode = {
  /** User rejected the connect/consent request. (≈ 4001) */
  USER_REJECTED: 4001,
  /** Origin is not connected / has no grant for this method. (≈ 4100) */
  UNAUTHORIZED: 4100,
  /** Method exists but the origin's scope doesn't cover it (model/tool not granted). */
  SCOPE_EXCEEDED: 4110,
  /** A per-action write consent was denied by the user. */
  CONSENT_DENIED: 4120,
  /** Budget or rate limit hit (tokens/day or calls/min). */
  BUDGET_EXCEEDED: 4290,
  /** Unknown method. (≈ 4200) */
  UNSUPPORTED_METHOD: 4200,
  /** Bad params. (≈ -32602) */
  INVALID_PARAMS: -32602,
  /** The sidekick daemon is not installed / not reachable. The SDK maps this to its
   *  "install the sidekick" fallback. */
  PROVIDER_UNAVAILABLE: 4900,
  /** Backend error (model/tool failed for a non-policy reason). */
  BACKEND_ERROR: 4500
};

// ../../packages/sdk/dist/connect-chip.js
function rungFromError(e) {
  if (e?.code !== BYOPErrorCode.PROVIDER_UNAVAILABLE)
    return null;
  return e?.data?.reason === "unpaired" ? { kind: "unpaired" } : { kind: "unreachable" };
}
var CHROME_STORE_URL = "https://chromewebstore.google.com/detail/injmjolmnekmahlnackakiamjepegagb";
var RELAY_DMG_URL = "https://github.com/sameeeeeeep/switchboard/releases/latest/download/Relay.dmg";
var STYLE = `
:host { all: initial; }
* { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
.chip, .btn { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; border: 0;
  font-size: 13px; font-weight: 600; line-height: 1; border-radius: 10px; }
/* The canonical connect lockup \u2014 the SAME mark + wordmark on every wrapp, so users recognize
   "Connect Switchboard" the way they knew the MetaMask button. Dark pill, lime glyph, locked in
   the shadow root so a host app can't restyle it away. */
.btn { padding: 9px 15px 9px 11px; background: #12151C; color: #E8EDF4; border: 1px solid #2C3444; }
.btn.connect:hover { background: #161B24; border-color: #3A4A18; }
.btn.get { color: #C3CAD6; border-color: #262C38; }
.btn.get:hover { color: #E8EDF4; border-color: #3A4353; }
.btn .arr { color: #6E7C90; font-weight: 500; margin-left: -2px; }
/* The Switchboard mark: lime rounded square with the top-right notch (matches the side-panel brand).
   Muted to slate when the sidekick isn't installed yet \u2014 the mark "lights up" once you can connect. */
.glyph { position: relative; width: 16px; height: 16px; border-radius: 5px; background: #C8F250;
  box-shadow: 0 0 12px rgba(200,242,80,.45); flex: none; }
.glyph::after { content: ""; position: absolute; top: 4px; right: 4px; width: 4px; height: 4px;
  border-radius: 50%; background: #0A0C10; }
.btn.get .glyph { background: #6E7C90; box-shadow: none; }
.wrap { position: relative; display: inline-block; }
.chip { background: #1A1F29; border: 1px solid #262C38; padding: 6px 10px 6px 7px; color: #E8EDF4; }
.chip:hover { border-color: #3A4353; }
.av { width: 26px; height: 26px; border-radius: 7px; background: #C8F250; color: #0A0C10; display: grid;
  place-items: center; font-weight: 700; font-size: 12px; overflow: hidden; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; }
.who { display: flex; flex-direction: column; gap: 3px; min-width: 0; text-align: left; }
.who .hi { font-size: 12.5px; font-weight: 600; white-space: nowrap; }
.who .proj { font-size: 10.5px; font-weight: 500; color: #99A3B7; white-space: nowrap; }
.caret { color: #6E7C90; font-size: 9px; margin-left: 2px; }
.menu { position: absolute; top: calc(100% + 6px); right: 0; z-index: 2147483000; width: 232px;
  background: #1A1F29; border: 1px solid #262C38; border-radius: 12px; padding: 7px;
  box-shadow: 0 18px 40px -20px rgba(0,0,0,.7); }
.menu .lbl { padding: 8px 10px 6px; font-size: 10px; font-weight: 600; letter-spacing: .06em;
  text-transform: uppercase; color: #6E7C90; }
.menu .proj-row { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 8px;
  background: #20262F; cursor: pointer; border: 0; width: 100%; color: #E8EDF4; font-size: 13px; font-weight: 600; }
.menu .proj-row:hover { background: #262d38; }
.menu .proj-row .go { margin-left: auto; color: #C8F250; font-size: 11px; font-weight: 600; }
.menu .sep { height: 1px; background: #262C38; margin: 6px 4px; }
.menu .item { display: block; width: 100%; text-align: left; padding: 8px 10px; border: 0; border-radius: 8px;
  background: transparent; color: #B4BECE; font-size: 13px; font-weight: 500; cursor: pointer; }
.menu .item:hover { background: #20262F; color: #E8EDF4; }
.menu .foot { padding: 8px 10px 4px; font-size: 11px; font-weight: 500; color: #6E7C90; line-height: 1.4; }
/* Setup-ladder pills (sidekick asleep / unpaired): quiet and informative, never red \u2014 nothing is
   broken. Amber only while the daemon is unreachable; the glyph stays muted until it's reachable. */
.dot { width: 7px; height: 7px; border-radius: 50%; background: #E8B84B; flex: none;
  box-shadow: 0 0 8px rgba(232,184,75,.45); }
.menu .body { padding: 8px 10px 2px; font-size: 12px; font-weight: 500; color: #B4BECE; line-height: 1.45; }
`;
function mountConnect(target, opts = {}) {
  const installUrl = opts.installUrl ?? "https://thelastprompt.ai/switchboard/";
  const host = document.createElement("div");
  host.style.display = "inline-block";
  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = STYLE;
  root.append(style);
  const mount = document.createElement("div");
  root.append(mount);
  target.append(host);
  let state2 = { kind: "booting" };
  let menuOpen = false;
  let destroyed = false;
  let relay = null;
  let seq = 0;
  let wasConnected = false;
  let lastProjectKey;
  let sessionDisconnected = false;
  const onDocClick = (e) => {
    if (menuOpen && !host.contains(e.target)) {
      menuOpen = false;
      render();
    }
  };
  document.addEventListener("click", onDocClick);
  const initEvent = `${PROVIDER_GLOBAL}#initialized`;
  let lateWatching = false;
  const onLateInit = () => {
    lateWatching = false;
    window.removeEventListener(initEvent, onLateInit);
    if (!destroyed)
      void refresh();
  };
  function watchForLateProvider() {
    if (lateWatching || destroyed)
      return;
    lateWatching = true;
    window.addEventListener(initEvent, onLateInit);
  }
  function el2(tag, cls, text2) {
    const n = document.createElement(tag);
    if (cls)
      n.className = cls;
    if (text2 != null)
      n.textContent = text2;
    return n;
  }
  async function refresh() {
    const my = ++seq;
    const r = await whenRelayReady(2500, { installUrl });
    if (destroyed || my !== seq)
      return;
    if (!(r instanceof Relay)) {
      watchForLateProvider();
      state2 = { kind: "not-installed", installUrl };
      return render();
    }
    relay = r;
    subscribe(r);
    const h = await r.health();
    if (destroyed || my !== seq)
      return;
    if (h && !h.reachable) {
      state2 = { kind: "unreachable", appMissing: h.installedHere === false };
      emitTransition(false);
      return render();
    }
    if (h && !h.paired) {
      state2 = { kind: "unpaired" };
      emitTransition(false);
      return render();
    }
    let permErr = null;
    const grant = sessionDisconnected ? null : await r.permissions().catch((e) => {
      permErr = e;
      return null;
    });
    if (destroyed || my !== seq)
      return;
    if (!grant) {
      const rung = !h ? rungFromError(permErr) : null;
      if (rung) {
        state2 = rung;
        emitTransition(false);
        return render();
      }
      state2 = { kind: "disconnected", relay: r };
      emitTransition(false);
      return render();
    }
    const wantsContext = opts.context !== "none";
    const [user, project] = await Promise.all([
      r.identity(),
      wantsContext ? r.context.active().catch(() => null) : Promise.resolve(null)
    ]);
    if (destroyed || my !== seq)
      return;
    const wasAlreadyConnected = wasConnected;
    state2 = { kind: "connected", relay: r, user, project };
    emitTransition(true);
    const projKey = project ? project.id ?? project.name : null;
    if (wasAlreadyConnected && lastProjectKey !== void 0 && projKey !== lastProjectKey)
      opts.onProjectChange?.(project);
    lastProjectKey = projKey;
    render();
  }
  function emitTransition(connected) {
    if (connected === wasConnected)
      return;
    wasConnected = connected;
    if (connected && relay)
      opts.onConnect?.(relay);
    else if (!connected)
      opts.onDisconnect?.();
  }
  let subscribed = false;
  function subscribe(r) {
    if (subscribed)
      return;
    subscribed = true;
    r.on("permissionsChanged", () => {
      void refresh();
    });
    r.on("disconnect", () => {
      void refresh();
    });
    r.on("health", () => {
      void refresh();
    });
  }
  async function doConnect() {
    if (!relay)
      return;
    try {
      sessionDisconnected = false;
      await relay.connect(opts.scope);
      await refresh();
    } catch (e) {
      const err = e;
      if (err?.code !== BYOPErrorCode.PROVIDER_UNAVAILABLE)
        return;
      await refresh();
      if (state2.kind === "disconnected") {
        const rung = rungFromError(err);
        if (rung) {
          state2 = rung;
          emitTransition(false);
          render();
        }
      }
    }
  }
  async function doPick() {
    if (!relay)
      return;
    menuOpen = false;
    render();
    await relay.context.pick().catch(() => null);
    await refresh();
  }
  async function doDisconnect() {
    if (!relay)
      return;
    menuOpen = false;
    sessionDisconnected = true;
    await relay.disconnect().catch(() => {
    });
    await refresh();
  }
  function render() {
    if (destroyed)
      return;
    mount.textContent = "";
    if (state2.kind === "booting")
      return;
    if (state2.kind === "not-installed") {
      const url = state2.installUrl;
      const wrap2 = el2("div", "wrap");
      const b = el2("button", "btn get");
      b.append(el2("span", "glyph"), el2("span", void 0, "Get Switchboard"), el2("span", "arr", "\u2197"));
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el2("div", "menu");
        menu.append(el2("div", "body", "Two parts: the Chrome extension, then Relay for Mac."));
        const store = el2("button", "item", "1 \xB7 Add to Chrome \u2197");
        store.onclick = () => {
          menuOpen = false;
          render();
          window.open(CHROME_STORE_URL, "_blank", "noopener");
        };
        const guide = el2("button", "item", "2 \xB7 Get Relay for Mac \u2197");
        guide.onclick = () => {
          menuOpen = false;
          render();
          window.open(url, "_blank", "noopener");
        };
        menu.append(store, guide);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state2.kind === "unreachable") {
      const appMissing = state2.appMissing === true;
      const wrap2 = el2("div", "wrap");
      const b = el2("button", "btn get");
      b.append(el2("span", "glyph"), el2("span", void 0, appMissing ? "Get Relay for Mac" : "Your sidekick is asleep"), el2("span", appMissing ? "arr" : "dot", appMissing ? "\u2197" : void 0), ...appMissing ? [] : [el2("span", "caret", "\u25BE")]);
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el2("div", "menu");
        if (appMissing) {
          menu.append(el2("div", "body", "Extension \u2713 \u2014 now the other half: Relay, the Mac app that holds your Claude."));
          const dl = el2("button", "item", "Download Relay.dmg \u2197");
          dl.onclick = () => {
            menuOpen = false;
            render();
            window.open(RELAY_DMG_URL, "_blank", "noopener");
          };
          menu.append(dl, el2("div", "sep"));
        } else {
          menu.append(el2("div", "body", "Open the Relay menubar app to wake it."));
          const retry = el2("button", "item", "Retry");
          retry.onclick = () => {
            menuOpen = false;
            render();
            void refresh();
          };
          menu.append(retry, el2("div", "sep"));
        }
        const setup = el2("button", "item", "New here? Full setup \u2197");
        setup.onclick = () => {
          menuOpen = false;
          render();
          window.open(installUrl, "_blank", "noopener");
        };
        menu.append(setup);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state2.kind === "unpaired") {
      const wrap2 = el2("div", "wrap");
      const b = el2("button", "btn connect");
      b.append(el2("span", "glyph"), el2("span", void 0, "Almost there \u2014 pair in the side panel"), el2("span", "caret", "\u25BE"));
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el2("div", "menu");
        menu.append(el2("div", "body", "Click the Switchboard icon in your Chrome toolbar and paste your pairing token."));
        const retry = el2("button", "item", "Retry");
        retry.onclick = () => {
          menuOpen = false;
          render();
          void refresh();
        };
        menu.append(retry);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state2.kind === "disconnected") {
      const b = el2("button", "btn connect");
      b.append(el2("span", "glyph"), el2("span", void 0, "Connect Switchboard"));
      b.onclick = doConnect;
      mount.append(b);
      return;
    }
    const { user, project } = state2;
    const rawName = user?.name?.trim();
    const collides = !!rawName && !!project?.name && rawName.toLowerCase() === project.name.toLowerCase();
    const name = !rawName || collides ? "there" : rawName;
    const wrap = el2("div", "wrap");
    const chip = el2("button", "chip");
    const av = el2("div", "av");
    if (user?.avatar) {
      const img = el2("img");
      img.src = user.avatar;
      img.alt = name;
      av.append(img);
    } else
      av.textContent = name.charAt(0).toUpperCase();
    const wantsContext = opts.context !== "none";
    const who = el2("div", "who");
    who.append(el2("div", "hi", `Hi ${name}`));
    who.append(el2("div", "proj", wantsContext ? project ? project.name : "No context lent" : "Connected"));
    chip.append(av, who, el2("span", "caret", "\u25BE"));
    chip.onclick = (e) => {
      e.stopPropagation();
      menuOpen = !menuOpen;
      render();
    };
    wrap.append(chip);
    if (menuOpen) {
      const menu = el2("div", "menu");
      if (wantsContext) {
        menu.append(el2("div", "lbl", "Working on"));
        const row = el2("button", "proj-row");
        row.append(el2("span", void 0, project ? project.name : "Choose a context"));
        row.append(el2("span", "go", project ? "Switch \u25B8" : "Choose \u25B8"));
        row.onclick = doPick;
        menu.append(row, el2("div", "sep"));
      }
      const dc = el2("button", "item", "Disconnect this app");
      dc.onclick = doDisconnect;
      menu.append(dc);
      menu.append(el2("div", "foot", "Connectors, budgets & activity live in the Switchboard toolbar panel."));
      wrap.append(menu);
    }
    mount.append(wrap);
  }
  render();
  void refresh();
  return {
    refresh: () => void refresh(),
    destroy: () => {
      destroyed = true;
      document.removeEventListener("click", onDocClick);
      window.removeEventListener(initEvent, onLateInit);
      host.remove();
    }
  };
}

// ../../packages/sdk/dist/index.js
var warnedStorageKeys = /* @__PURE__ */ new Set();
function warnBadStorageKey(key) {
  if (isValidStorageKey(key) || warnedStorageKeys.has(key))
    return;
  warnedStorageKeys.add(key);
  const suggestion = String(key).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^[^A-Za-z0-9]+/, "") || "key";
  console.warn(`[relay.storage] invalid key ${JSON.stringify(key)} \u2014 this write/read WILL be rejected by the daemon and silently do nothing.
  Keys map 1:1 to files (<key>.json) in this origin's folder, so they must match ${STORAGE_KEY_RE}.
  ":" is not allowed (illegal on NTFS; "a:b" is Alternate Data Stream syntax on Windows). Try ${JSON.stringify(suggestion)}.`);
}
var Relay = class {
  provider;
  constructor(provider) {
    this.provider = provider;
  }
  get version() {
    return this.provider.version;
  }
  capabilities() {
    return this.provider.request({ method: "claude_capabilities" });
  }
  connect(scope) {
    return this.provider.request({ method: "claude_connect", params: scope });
  }
  /** Drop this app's connection for the current page session. The grant persists (a later connect()
   *  won't reprompt) — this is "disconnect from this tab", not "revoke". Full revoke lives in the panel. */
  disconnect() {
    return this.provider.request({ method: "claude_disconnect" });
  }
  permissions() {
    return this.provider.request({ method: "claude_permissions" });
  }
  /** The setup-ladder snapshot (reachable/paired/connected), answered by the EXTENSION from its
   *  own state — never the daemon — so it resolves fast (<1s) in every degraded state, including
   *  the ones where every other method would hang. Resolves null when the extension is too old to
   *  know `claude_health` (or its worker is unreachable): callers MUST treat null as "unknown"
   *  and fall back to probing permissions() exactly as before — that skew guard is load-bearing
   *  while store users run an older extension against newer app bundles. */
  health() {
    const answer = this.provider.request({ method: "claude_health" }).catch(() => null);
    const timer = new Promise((resolve2) => setTimeout(() => resolve2(null), 1500));
    return Promise.race([answer, timer]);
  }
  /** The paired user's public identity (name/avatar), or null if unavailable. Convenience over
   *  capabilities().user — what the connect chip greets with ("Hi Sameep"). */
  identity() {
    return this.capabilities().then((c) => c.user ?? null).catch(() => null);
  }
  /** Synthesize speech ON-DEVICE via a local model/engine (no cloud, no connector, no credits).
   *  Returns audio as a playable data: URL, or null if no local TTS is available.
   *
   *    const clip = await relay.speak("hey, it's Maya");
   *    if (clip) new Audio(clip.audio).play();
   */
  speak(text2, opts) {
    return this.provider.request({ method: "claude_speak", params: { text: text2, voice: opts?.voice } }).catch(() => null);
  }
  listTools() {
    return this.provider.request({ method: "claude_listTools" }).then((r) => r.tools);
  }
  callTool(name, args) {
    const call = { name, arguments: args };
    return this.provider.request({ method: "claude_callTool", params: call });
  }
  complete(params) {
    return this.provider.request({ method: "claude_complete", params });
  }
  /** Streamed completion as an async iterator of deltas. Ends after a `done`/`error` delta. */
  async *stream(params) {
    const { streamId } = await this.provider.request({ method: "claude_stream", params });
    const queue = [];
    let notify = null;
    let ended = false;
    const handler = (payload) => {
      const p = payload;
      if (p.streamId !== streamId)
        return;
      queue.push(p);
      if (p.type === "done" || p.type === "error")
        ended = true;
      notify?.();
    };
    this.provider.on("delta", handler);
    try {
      while (true) {
        if (queue.length === 0) {
          if (ended)
            break;
          await new Promise((r) => notify = r);
          notify = null;
          continue;
        }
        yield queue.shift();
      }
    } finally {
      this.provider.removeListener("delta", handler);
    }
  }
  on(event, handler) {
    this.provider.on(event, handler);
  }
  /**
   * Per-origin local storage — a private on-disk key/value store for this app, plus `bind` to point
   * it at a real folder the user picks. Values are opaque strings (store JSON). Isolated per origin;
   * reads are free, writes need the site not to be read-only, and `bind` prompts for the exact path.
   *
   *   await relay.storage.set("workspace", JSON.stringify(data));
   *   const raw = await relay.storage.get("workspace");
   *   await relay.storage.bind("~/Documents/Projects/brandbrain/.data"); // existing files appear as records
   */
  get storage() {
    const req = (params) => this.provider.request({ method: "claude_storage", params });
    const k = (key) => {
      warnBadStorageKey(key);
      return key;
    };
    return {
      get: (key) => req({ op: "get", key: k(key) }).then((r) => r.value ?? null),
      set: (key, value) => req({ op: "set", key: k(key), value }).then(() => void 0),
      delete: (key) => req({ op: "delete", key: k(key) }).then((r) => r.ok),
      list: () => req({ op: "list" }).then((r) => r.keys ?? []),
      info: () => req({ op: "info" }).then((r) => r.info),
      /** Point this app's store at a real folder (triggers a path-consent click). */
      bind: (path) => req({ op: "bind", path }).then((r) => r.info),
      /** Open a NATIVE folder chooser on the daemon's machine (macOS today). The user picking a
       *  folder in an OS dialog that names this origin IS the path consent, so a successful pick
       *  comes back already bound. Resolves undefined on cancel or when no native picker exists —
       *  keep a typed-path `bind` as the fallback UI. */
      pick: (reason) => req({ op: "pick", reason }).then((r) => r.info).catch(() => void 0)
    };
  }
  /**
   * Shared, cross-app context — your portable brand knowledge. Publish a whole context; read the one
   * the user selected for this app; or open the picker. Selection happens in the side panel, so an
   * app only ever receives the context the user chose to lend it — never the whole library.
   *
   *   await relay.context.publish({ name: "Aamras", kind: "brand", data: brand });
   *   const active = await relay.context.active();   // the brand the user loaded for this app, or null
   */
  get context() {
    const req = (params) => this.provider.request({ method: "claude_context", params });
    return {
      publish: (context) => req({ op: "publish", context }).then((r) => r.id),
      list: () => req({ op: "list" }).then((r) => r.contexts ?? []),
      active: () => req({ op: "active" }).then((r) => r.context ?? null),
      pick: () => req({ op: "pick" }).then((r) => r.context ?? null),
      /** Read ONE context listed via `list()` in full, and make it this app's selection. Needs the
       *  kind granted at connect (ScopeRequest.contextKinds) — powers in-app brand dropdowns. */
      use: (id) => req({ op: "use", id }).then((r) => r.context ?? null)
    };
  }
};
var DEFAULT_INSTALL_URL = "https://thelastprompt.ai/switchboard/";
function getRelay(opts) {
  const provider = globalThis[PROVIDER_GLOBAL];
  if (provider?.isRelay)
    return new Relay(provider);
  return { installed: false, installUrl: opts?.installUrl ?? DEFAULT_INSTALL_URL };
}
function whenRelayReady(timeoutMs = 3e3, opts) {
  const now = getRelay(opts);
  if (now instanceof Relay)
    return Promise.resolve(now);
  return new Promise((resolve2) => {
    const onInit = () => {
      cleanup();
      resolve2(getRelay(opts));
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve2({ installed: false, installUrl: opts?.installUrl ?? DEFAULT_INSTALL_URL });
    }, timeoutMs);
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener(`${PROVIDER_GLOBAL}#initialized`, onInit);
    }
    window.addEventListener(`${PROVIDER_GLOBAL}#initialized`, onInit);
  });
}

// src/cast/spec.js
var STAGES = [
  {
    id: "reference",
    title: "Start",
    kicker: "One thing to build from",
    blurb: "You gave Cast one thing \u2014 a line, a reference account, or a photo. This is the brief a research agent grounded from it; edit anything here and everything downstream is judged against it.",
    advance: "brief locked"
    // reference.locked === true
  },
  {
    id: "foundation",
    title: "Foundation",
    kicker: "Decide who this account is",
    blurb: "Every facet of the account \u2014 the person, their voice, the world they film in, who they're for, what they post \u2014 proposed as distinct directions. Cast locks the recommended one as options land; tap any other card to overrule it. Each lock sharpens the next. This is the persona's spec.",
    advance: "all facets locked"
  },
  {
    id: "assets",
    title: "Base assets",
    kicker: "Generate the persona's consistent world",
    blurb: "From the locked foundation, Cast generates the face, the setting, the wardrobe and the supporting cast \u2014 the reusable, on-model world every post is shot in. You approve each one; nothing is used until you say so.",
    advance: "face + setting approved"
  },
  {
    id: "calendar",
    title: "Calendar",
    kicker: "Plan what the account posts",
    blurb: "Research agents propose a dated content plan mapped to the account's pillars \u2014 what's trending, what fits the persona, spaced across weeks. You approve topics into the calendar; approved slots become the production queue.",
    advance: "\u22651 slot approved"
  },
  {
    id: "scripts",
    title: "Scripts",
    kicker: "Write each post",
    blurb: "Every approved slot becomes a shot-list and voice lines, in the persona's voice, grounded in the topic. You approve or steer each script before a single frame is generated.",
    advance: "\u22651 script approved"
  },
  {
    id: "produce",
    title: "Produce",
    kicker: "Shoot, stitch, approve",
    blurb: "Each approved script is generated shot by shot on the locked face and setting, then stitched into a reel with an on-device voice. You approve each shot, then the final cut \u2014 the last gate before it's a real post.",
    advance: "done"
  }
];
var STAGE_IDS = STAGES.map((s) => s.id);
var stageIndex = (id) => Math.max(0, STAGE_IDS.indexOf(id));
var FACETS = [
  {
    id: "persona",
    title: "The person",
    blurb: "Who is behind the account \u2014 a real-feeling human, not a brand mascot.",
    icon: "user",
    select: "one",
    count: 3,
    web: false,
    deps: [],
    fields: "Propose distinct HUMAN creators who could credibly own this niche. Each card: title = a real first+last name; subtitle = their one-line identity (age-ish, where they are, what they did before); body = why this person is a sharp fit for the niche in one sentence; chips = 3 personality traits. Never name them after any brand. Make the three genuinely different people, not variations of one.",
    steer: "e.g. 'make them Mumbai-based, ex-engineer' \u2014 or write your exact person"
  },
  {
    id: "voice",
    title: "Voice",
    blurb: "How they talk on camera and in captions.",
    icon: "quote",
    select: "one",
    count: 3,
    web: false,
    deps: ["persona"],
    fields: "Propose distinct on-camera voices for this exact person. Each card: title = the voice in 2-3 words (e.g. 'Dry & deadpan'); body = one sentence on how they sound; bullets = 2 example caption openers written in that voice; chips = 3 tone words. The voices must plausibly belong to the locked person.",
    steer: "e.g. 'drier, faster, no emojis' \u2014 or describe your exact voice"
  },
  {
    id: "aesthetic",
    title: "Aesthetic",
    blurb: "The visual signature \u2014 grade, framing, palette.",
    icon: "image",
    select: "one",
    count: 3,
    web: false,
    deps: ["persona"],
    fields: "Propose distinct visual signatures the account is shot in. Each card: title = the look in 2-3 words; body = one sentence on grade + framing + light; palette = 3-4 named hex swatches that define the grade; chips = 2 texture/mood words. These are directable image-generation styles, so be concrete about colour and light.",
    steer: "e.g. 'shot on iPhone, warmer, no studio look'"
  },
  {
    id: "setting",
    title: "Setting",
    blurb: "The world the account lives in \u2014 where every shot is filmed.",
    icon: "map",
    select: "one",
    count: 3,
    web: false,
    deps: ["persona", "aesthetic"],
    fields: "Propose distinct home-base worlds this person films in, consistent with their identity and the locked aesthetic. Each card: title = the place in 2-3 words (e.g. 'Sunlit Lisbon flat'); body = one sentence describing the space and light; bullets = 3 recurring backdrops within it (kitchen counter, balcony, etc). Must be a plausible single lived-in world, not a mood board.",
    steer: "e.g. 'a small Bangalore flat, lots of plants' \u2014 or your real space"
  },
  {
    id: "audience",
    title: "Audience",
    blurb: "Who this is for \u2014 the follower it's built to win.",
    icon: "users",
    select: "one",
    count: 3,
    web: false,
    deps: ["persona", "voice"],
    fields: "Propose distinct core-follower profiles this account is built to win. Each card: title = the follower in a phrase; subtitle = a rough demographic; body = one sentence on what they come to the account FOR; chips = 2 things they'd double-tap. Pick the audience the locked person + voice would actually pull.",
    steer: "e.g. 'founders and PMs, not hobbyists'"
  },
  {
    id: "pillars",
    title: "Content pillars",
    blurb: "The 3-4 recurring themes the account posts against \u2014 the backbone of the calendar.",
    icon: "layers",
    select: "many",
    count: 5,
    web: true,
    deps: ["persona", "voice", "audience"],
    fields: "Propose recurring content pillars for this account \u2014 the repeatable themes it posts against. Use current web signal for what's landing in this niche. Each card: title = the pillar in 2-4 words; body = one sentence on what a post in this pillar looks like; chips = 2 example post ideas. Founder picks 3-4. These become the spine of the content calendar, so make them distinct and productive.",
    steer: "e.g. 'add a weekly myth-busting series' \u2014 or add your own pillar"
  }
];
var FACET_IDS = FACETS.map((f) => f.id);
var facetAt = (id) => FACETS.find((f) => f.id === id);
var ASSETS = [
  { id: "face", title: "The face", one: true, gate: true, from: ["persona", "aesthetic"], seed: (f) => `photoreal front-facing portrait of ${f.persona}, ${f.aesthetic} look, natural light, consistent identity reference` },
  { id: "setting", title: "The setting", one: true, gate: true, from: ["setting", "aesthetic"], seed: (f) => `${f.setting}, ${f.aesthetic} grade, empty establishing shot, no people` },
  { id: "wardrobe", title: "Wardrobe", one: false, gate: false, from: ["persona", "aesthetic"], seed: (f) => `outfit for ${f.persona}, ${f.aesthetic} styling, flat-lay on-model reference` },
  { id: "cast", title: "Supporting cast", one: false, gate: false, from: ["persona", "setting"], seed: (f) => `portrait of a recurring supporting character in ${f.persona}'s world` }
];
function facetContext(account) {
  const ref = account.reference || {};
  const locks = account.foundation?.locks || {};
  const lines = [];
  const brand = brandLine(account);
  if (brand) lines.push(brand);
  if (ref.brief) lines.push(`The account's brief (the founder's starting intent): ${ref.brief}`);
  if (ref.fromPhoto && account.assets?.face?.url) lines.push("The founder supplied a real photo of the person \u2014 the face is already locked. Every persona option must plausibly BE the person in that photo; do not invent a different look.");
  if (ref.niche) lines.push(`Niche: ${ref.niche}.`);
  if (ref.inspirations?.length) lines.push(`Reference accounts the founder admires: ${ref.inspirations.map((i) => i.handle).filter(Boolean).join(", ")}.`);
  if (ref.moodNotes) lines.push(`Mood / direction notes: ${ref.moodNotes}`);
  const decided = FACET_IDS.map((id) => locks[id] && `- ${facetAt(id).title}: ${cardSummary(locks[id])}`).filter(Boolean);
  if (decided.length) {
    lines.push("", "Decisions locked so far \u2014 this is the source of truth; where the brief and a lock disagree, the LOCK wins:", ...decided);
  }
  return lines.join("\n");
}
function cardSummary(card) {
  if (!card) return "";
  return [card.title, card.subtitle, card.body].filter(Boolean).join(" \u2014 ");
}
function brandLine(account) {
  const b = account.brand;
  if (!b) return "";
  const bits = [`The persona is an independent creator who makes content FOR the brand "${b.name}" (a context the founder lent from Switchboard) \u2014 a distinct real human, NEVER named after the brand.`];
  const d = b.data || {};
  if (d.positioning || d.tagline) bits.push(`Brand positioning: ${d.positioning || d.tagline}.`);
  if (d.niche || d.category) bits.push(`Brand category: ${d.niche || d.category}.`);
  if (Array.isArray(d.palette) && d.palette.length) bits.push(`Brand palette (use as accents): ${d.palette.join(", ")}.`);
  return bits.join(" ");
}
function brandStyle(account) {
  const d = account.brand?.data || {};
  const pal = Array.isArray(d.palette) ? d.palette.slice(0, 3).join(", ") : "";
  return account.brand ? `in ${account.brand.name} brand style${pal ? `, palette accents ${pal}` : ""}` : "";
}
function facetValues(account) {
  const locks = account.foundation?.locks || {};
  const v = {};
  for (const id of FACET_IDS) v[id] = cardSummary(locks[id]) || facetAt(id).title;
  return v;
}
function facetPrompt(account, facet) {
  const ctx = facetContext(account);
  const note = account.foundation?.steers?.[facet.id];
  const shape = `{"title","subtitle"?,"body"?,"bullets"?:[..],"chips"?:[..],"palette"?:[{"name","hex"}],"recommended"?:bool}`;
  return [
    ctx,
    "",
    `Now generate ${facet.count} DISTINCT options for the facet "${facet.title}". ${facet.fields}`,
    note ? `The founder's steering note for this facet \u2014 every option must honour it: "${note}"` : "",
    facet.web ? "Use WebSearch for current, real signal in this niche before answering." : "Answer from what's already decided \u2014 do not contradict a lock.",
    facet.select === "one" ? "Mark exactly one option as recommended." : "Do not mark any as recommended; the founder picks several.",
    `Reply with ONLY a JSON array of ${facet.count} objects shaped ${shape}. No prose.`
  ].filter(Boolean).join("\n");
}

// src/cast/state.js
var ACCOUNT_PREFIX = "account-";
var newId = () => "a_" + Math.random().toString(36).slice(2, 9);
var safeParse = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};
function blankAccount() {
  return {
    id: newId(),
    handle: "",
    stage: "reference",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    brand: null,
    // the ONE brand context lent from Switchboard — a {id,name,kind,data} snapshot
    reference: { brief: "", niche: "", inspirations: [], moodNotes: "", locked: false },
    foundation: { locks: {}, cards: {}, more: {}, auto: {}, steers: {} },
    // more: facetId → extra picks for select:many; steers: facetId → the founder's steering note
    assets: { face: null, setting: null, wardrobe: [], cast: [] },
    // each asset: {id?,url,status,approved,prompt}
    calendar: { slots: [] },
    // {id,date,pillar,title,angle,source,status,approved}
    scripts: {},
    // slotId → {beats:[{shot,line}],approved,status}
    productions: {}
    // slotId → {shots:[{id,desc,url,status,approved}],stitchedUrl,approved,status}
  };
}
async function loadAccounts(relay) {
  try {
    const keys = (await relay.storage.list()).filter((k) => k.startsWith(ACCOUNT_PREFIX));
    const raw = await Promise.all(keys.map((k) => relay.storage.get(k)));
    return raw.map(safeParse).filter(Boolean).map(migrate).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch {
    return [];
  }
}
async function persist(relay, a) {
  a.updatedAt = Date.now();
  try {
    await relay.storage.set(ACCOUNT_PREFIX + a.id, JSON.stringify(a));
    if (a.assets?.face?.approved && a.foundation?.locks?.persona) {
      await relay.context.publish({ id: a.id, name: personaName(a), kind: "persona", data: personaContext(a) });
    }
  } catch {
  }
}
function personaContext(a) {
  const f = a.foundation?.locks || {};
  return {
    name: personaName(a),
    niche: a.reference?.niche || "",
    brand: a.brand ? { id: a.brand.id, name: a.brand.name } : null,
    // which brand this persona creates for
    persona: cardSummary(f.persona),
    voice: cardSummary(f.voice),
    aesthetic: cardSummary(f.aesthetic),
    setting: cardSummary(f.setting),
    audience: cardSummary(f.audience),
    pillars: pillarList(a).map(cardSummary),
    face: a.assets?.face?.url || null,
    wardrobe: (a.assets?.wardrobe || []).filter((x) => x.approved).map((x) => ({ name: x.name, url: x.url })),
    locations: a.assets?.setting?.url ? [{ name: "Setting", url: a.assets.setting.url }] : []
  };
}
function personaName(a) {
  return (a.foundation?.locks?.persona?.title || a.handle || "Untitled account").trim();
}
function pillarList(a) {
  const locks = a.foundation?.locks || {}, more = a.foundation?.more || {};
  const out = [];
  if (locks.pillars) out.push(locks.pillars);
  (more.pillars || []).forEach((c) => out.push(c));
  return out;
}
function lockFacet(a, facetId, card, opts = {}) {
  const fnd = a.foundation;
  const prev = fnd.locks[facetId];
  const facet = facetAt(facetId);
  if (facet.select === "many") {
    const all = [prev, ...fnd.more[facetId] || []].filter(Boolean);
    const has = all.find((c) => c.id === card.id);
    const next = has ? all.filter((c) => c.id !== card.id) : [...all, card];
    fnd.locks[facetId] = next[0] || null;
    fnd.more[facetId] = next.slice(1);
    if (!fnd.locks[facetId]) delete fnd.locks[facetId];
  } else {
    fnd.locks[facetId] = card;
  }
  delete fnd.auto[facetId];
  const changed = !prev || prev.id !== card.id;
  if (changed) cascadeStale(a, facetId);
  return staleDependents(facetId);
}
function cascadeStale(a, facetId) {
  for (const dep of staleDependents(facetId)) {
    delete a.foundation.cards[dep];
  }
}
function staleDependents(facetId) {
  const out = /* @__PURE__ */ new Set();
  const walk = (id) => {
    for (const f of FACETS) if (f.deps.includes(id) && !out.has(f.id)) {
      out.add(f.id);
      walk(f.id);
    }
  };
  walk(facetId);
  return [...out];
}
function facetUnlocked(a, facetId) {
  return facetAt(facetId).deps.every((d) => a.foundation.locks[d]);
}
function facetStatus(a, facetId, loading) {
  const fnd = a.foundation;
  if (fnd.locks[facetId]) return "locked";
  if (loading?.has?.(facetId)) return "researching";
  if (fnd.cards[facetId]?.length) return "ready";
  if (!facetUnlocked(a, facetId)) return "blocked";
  return "queued";
}
function stageReady(a, stageId) {
  switch (stageId) {
    case "reference":
      return !!a.reference?.locked;
    case "foundation":
      return FACET_IDS.every((id) => a.foundation.locks[id]);
    case "assets":
      return !!(a.assets?.face?.approved && a.assets?.setting?.approved);
    case "calendar":
      return (a.calendar?.slots || []).some((s) => s.approved);
    case "scripts":
      return Object.values(a.scripts || {}).some((s) => s.approved);
    case "produce":
      return Object.values(a.productions || {}).some((p) => p.approved);
    default:
      return false;
  }
}
function reachableStage(a) {
  let last = STAGE_IDS[0];
  for (let i = 0; i < STAGE_IDS.length; i++) {
    last = STAGE_IDS[i];
    if (!stageReady(a, STAGE_IDS[i])) break;
    if (i + 1 < STAGE_IDS.length) last = STAGE_IDS[i + 1];
  }
  return last;
}
function progress(a) {
  const done = STAGE_IDS.filter((id) => stageReady(a, id)).length;
  return done / STAGE_IDS.length;
}
function migrate(doc) {
  if (doc && doc.stage && doc.foundation) {
    doc.foundation.steers = doc.foundation.steers || {};
    return doc;
  }
  const a = blankAccount();
  if (!doc) return a;
  a.id = doc.id || a.id;
  a.handle = doc.name || doc.handle || "";
  a.reference = { brief: doc.story || "", niche: doc.niche || "", inspirations: [], moodNotes: doc.vibe || "", locked: !!(doc.niche || doc.story) };
  if (doc.name) {
    a.foundation.locks.persona = { id: newId(), title: doc.name, subtitle: doc.niche || "", body: doc.story || "" };
    if (doc.vibe) a.foundation.locks.voice = { id: newId(), title: "Imported voice", body: doc.vibe };
  }
  if (doc.look?.referenceImage) a.assets.face = { url: doc.look.referenceImage, status: "done", approved: true };
  a.assets.wardrobe = (doc.wardrobe || []).map((w) => ({ id: w.id || newId(), name: w.name, url: w.referenceImage, status: "done", approved: true }));
  if (doc.locations?.[0]) a.assets.setting = { url: doc.locations[0].referenceImage, status: "done", approved: true, name: doc.locations[0].name };
  a.assets.cast = (doc.cast || []).map((c) => ({ id: c.id || newId(), name: c.name, url: c.referenceImage, relationship: c.relationship, status: "done", approved: true }));
  a.stage = reachableStage(a);
  return a;
}

// src/cast/gen.js
var IMG = "generate_image";
var VID = "generate_video";
var MODELS = {
  face: "soul_2",
  // photoreal UGC portrait — the persona's identity anchor
  setting: "soul_location",
  // purpose-built environments / locations
  shot: "nano_banana_pro",
  // on-model action shots: best prompt adherence + identity ref, no forced enhance
  animate: "kling3_0_turbo",
  // fast single start-frame → vertical clip
  animateRich: "kling3_0",
  // multi-shot + audio sync when a beat needs it
  motion: "seedance_2_0",
  // reference-driven (image identity + video/audio refs) — true video→video
  talk: "wan2_7"
  // audio-driven, character-consistent — persona SAYS the line, lip-synced
};
var TTS = "generate_audio";
var q = Promise.resolve();
function queued(run) {
  const p = q.then(run, run);
  q = p.then(() => {
  }, () => {
  });
  return p;
}
function runStream(relay, req, { onTool, pick } = {}) {
  return queued(async () => {
    let acc = "", picked = null;
    for await (const d of relay.stream(req)) {
      if (d.type === "tool_proposed") onTool?.(d.call.name);
      else if (d.type === "tool_result" && d.result?.ok && pick) {
        const u = pick(text(d));
        if (u) picked = u;
      } else if (d.type === "text") acc += d.text;
      else if (d.type === "error") throw new Error(d.error.message);
    }
    return { acc, picked };
  });
}
async function generateCards(relay, prompt, { web = false } = {}) {
  const arr = await streamJsonArray(relay, prompt, web);
  return arr.filter(Boolean).map((o) => normalizeCard(o));
}
function normalizeCard(o) {
  return {
    id: o.id || newId(),
    title: o.title || o.name || "Untitled",
    subtitle: o.subtitle || o.niche || void 0,
    body: o.body || o.angle || o.rationale || void 0,
    bullets: Array.isArray(o.bullets) ? o.bullets : void 0,
    chips: Array.isArray(o.chips) ? o.chips : Array.isArray(o.tags) ? o.tags : void 0,
    palette: Array.isArray(o.palette) ? o.palette.map((p) => typeof p === "string" ? { name: p, hex: p } : p) : void 0,
    meta: Array.isArray(o.meta) ? o.meta : void 0,
    recommended: !!o.recommended
  };
}
async function streamJsonArray(relay, prompt) {
  const { acc } = await runStream(relay, { prompt, agentic: true });
  for (const raw of [acc.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1], acc.match(/\[[\s\S]*\]/)?.[0]]) {
    if (!raw) continue;
    try {
      const v = JSON.parse(raw.match(/\[[\s\S]*\]/)?.[0] || raw);
      if (Array.isArray(v)) return v;
    } catch {
    }
  }
  return [];
}
async function streamJsonObject(relay, prompt, { attachments } = {}) {
  const { acc } = await runStream(relay, { prompt, agentic: true, ...attachments ? { attachments } : {} });
  for (const raw of [acc.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1], acc.match(/\{[\s\S]*\}/)?.[0]]) {
    if (!raw) continue;
    try {
      return JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw);
    } catch {
    }
  }
  return null;
}
async function generateImage(relay, prompt, aspect = "1:1", model = MODELS.shot) {
  const instruction = `Use the Higgsfield ${IMG} tool with model "${model}" to generate an image of: "${prompt}", aspect_ratio "${aspect}". Wait for it (poll if needed), then reply with ONLY the final image URL on its own line.`;
  return agenticImage(relay, instruction, []);
}
async function generateOnModel(relay, prompt, aspect, refs, onTool, model = MODELS.shot) {
  const attachments = await attachmentsFor(refs);
  const instruction = refInstruction(prompt, aspect, refs, model);
  return agenticImage(relay, instruction, attachments, onTool);
}
async function generateVideo(relay, keyframeUrl, motion = "subtle, natural", model = MODELS.animate) {
  const instruction = `Animate this keyframe into a short vertical (9:16) social clip.
Keyframe image URL: ${keyframeUrl}
Use the Higgsfield ${VID} tool with model "${model}" and that keyframe as the start frame; motion: ${motion}.
Poll job status until done, then reply with ONLY the final video URL on its own line.`;
  const { acc, picked } = await runStream(relay, { prompt: instruction, agentic: true }, { pick: extractVideoUrl });
  return picked || extractVideoUrl(acc);
}
async function stitchClips(relay, clipUrls) {
  if (!clipUrls.length) return null;
  if (clipUrls.length === 1) return clipUrls[0];
  const instruction = `Stitch these vertical clips into ONE continuous 9:16 reel, in this order:
${clipUrls.map((u, i) => `${i + 1}. ${u}`).join("\n")}
Use a Higgsfield video concatenation/stitch tool. Poll until done, then reply with ONLY the final stitched video URL on its own line.`;
  const { acc, picked } = await runStream(relay, { prompt: instruction, agentic: true }, { pick: extractVideoUrl });
  return picked || extractVideoUrl(acc) || clipUrls[0];
}
async function generateSpeech(relay, line, voice) {
  const instruction = `Use the Higgsfield ${TTS} tool to speak this line as natural, warm creator narration: "${line}".${voice ? ` Use the voice "${voice}".` : ""} Poll until done, then reply with ONLY the final audio URL on its own line.`;
  const { acc, picked } = await runStream(relay, { prompt: instruction, agentic: true }, { pick: extractAudioUrl });
  return picked || extractAudioUrl(acc);
}
async function beatClip(relay, startImageUrl, faceUrl, audioUrl, action, onTool, model = MODELS.motion) {
  const steps = [
    `media_upload+confirm the storyboard still \u21D2 start_image`,
    `media_upload+confirm the face \u21D2 face_id (identity)`,
    audioUrl ? `media_import_url the voiceover \u21D2 audio_id` : null
  ].filter(Boolean).join("; ");
  const medias = [`{role:"start_image",value:start_image}`, `{role:"image_references",value:face_id}`, audioUrl ? `{role:"audio_references",value:audio_id}` : null].filter(Boolean).join(",");
  const instruction = `Generate a REAL short vertical (9:16) video clip of the persona performing: "${action}". Not a still pan \u2014 actual motion, cooking/action as described, ${audioUrl ? "lip-synced / paced to the voiceover, " : ""}keeping the SAME identity, using Higgsfield ${VID} with model "${model}".
Storyboard still URL: ${startImageUrl}
Face identity URL: ${faceUrl}
${audioUrl ? `Voiceover audio URL: ${audioUrl}
` : ""}Steps: ${steps}. Then call ${VID} with model "${model}", medias [${medias}], aspect_ratio "9:16". Poll until done, reply with ONLY the final video URL on its own line.`;
  const { acc, picked } = await runStream(relay, { prompt: instruction, agentic: true }, { onTool, pick: extractVideoUrl });
  return picked || extractVideoUrl(acc);
}
async function agenticImage(relay, instruction, attachments, onTool) {
  const { acc, picked } = await runStream(relay, { prompt: instruction, agentic: true, attachments }, { onTool, pick: extractUrl });
  return picked || extractUrl(acc);
}
function refInstruction(promptText, aspect, refs, model = MODELS.shot) {
  const steps = refs.map((r, i) => `${i + 1}) media_upload({filename:"${r.filename}",content_type:"image/png"}) \u2192 relay put_blob({handle:"${r.handle}",url:<uploadUrl>}) \u2192 media_confirm \u21D2 media_id_${r.handle}`).join("\n");
  return `Generate an on-model image of: "${promptText}", aspect_ratio "${aspect}".
Keep the SAME face as reference "face". Reference handles attached: ${refs.map((r) => r.handle).join(", ")}.
For EACH handle in order:
${steps}
Then call Higgsfield ${IMG} with model "${model}" and ALL media_id_* in medias (role "image", face first) so face, wardrobe and setting stay consistent. Poll until done, then reply with ONLY the final image URL on its own line.`;
}
async function refDrive(relay, identityUrl, refVideoUrl, prompt, onTool, model = MODELS.motion) {
  const instruction = `Make a short vertical (9:16) social reel that follows the ENERGY and pacing of a reference clip while keeping OUR persona's identity, using Higgsfield ${VID} with model "${model}" (reference-driven).
Persona identity image URL: ${identityUrl}
Reference reel URL: ${refVideoUrl}
What happens: ${prompt}
Steps: media_upload+confirm the identity image \u21D2 id_a; media_import_url the reference reel \u21D2 id_b. Then call ${VID} with model "${model}", the prompt, and medias [{role:"image_references",value:id_a},{role:"video_references",value:id_b}], aspect_ratio "9:16". Poll until done, then reply with ONLY the final video URL on its own line.`;
  const { acc, picked } = await runStream(relay, { prompt: instruction, agentic: true }, { onTool, pick: extractVideoUrl });
  return picked || extractVideoUrl(acc);
}
async function attachmentsFor(refs) {
  return Promise.all(refs.map(async (r) => ({ handle: r.handle, filename: r.filename, contentType: "image/png", dataUrl: await downscale(r.url) })));
}
var text = (d) => (d.result?.content ?? []).map((c) => c.text ?? "").join("");
var URL_RE = /(https?:\/\/[^\s"')]+\.(?:png|jpe?g|webp))|"(?:rawUrl|url|minUrl)"\s*:\s*"([^"]+)"/i;
var VIDEO_RE = /(https?:\/\/[^\s"')]+\.(?:mp4|webm|mov|m3u8))|"(?:videoUrl|video_url|url)"\s*:\s*"([^"]+\.(?:mp4|webm|mov)[^"]*)"/i;
var AUDIO_RE = /(https?:\/\/[^\s"')]+\.(?:mp3|wav|m4a|ogg|aac))|"(?:audioUrl|audio_url|url)"\s*:\s*"([^"]+\.(?:mp3|wav|m4a|ogg|aac)[^"]*)"/i;
function extractUrl(t) {
  const m = (t || "").match(URL_RE);
  return m ? m[1] || m[2] || m[0] : null;
}
function extractVideoUrl(t) {
  const m = (t || "").match(VIDEO_RE);
  return m ? m[1] || m[2] || m[0] : null;
}
function extractAudioUrl(t) {
  const m = (t || "").match(AUDIO_RE);
  return m ? m[1] || m[2] || m[0] : null;
}
async function downscale(dataUrl, max = 1024) {
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = dataUrl;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    return c.toDataURL("image/png");
  } catch {
    return dataUrl;
  }
}
var wait = (ms) => new Promise((r) => setTimeout(r, ms));
function svgTile(label, a, b, w = 320, h = 320) {
  const words = String(label).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const wd of words) {
    if ((cur + " " + wd).trim().length > 16) {
      lines.push(cur.trim());
      cur = wd;
    } else cur += " " + wd;
  }
  if (cur.trim()) lines.push(cur.trim());
  const cy = h / 2 - (lines.length - 1) * 11;
  const tspans = lines.slice(0, 4).map((ln, i) => `<text x='${w / 2}' y='${cy + i * 22}' font-family='Space Grotesk, sans-serif' font-size='16' font-weight='600' fill='rgba(255,255,255,.94)' text-anchor='middle'>${ln}</text>`).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='${w}' height='${h}' fill='url(#g)'/>${tspans}</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
var COLORS = [["#FF5A3C", "#FFB05A"], ["#6B4CF0", "#9B7BFF"], ["#2FA96B", "#7FD8A8"], ["#FF8A3D", "#6B4CF0"]];

// src/cast/ui.js
var $ = (id) => document.getElementById(id);
var el = (t, c, x) => {
  const n = document.createElement(t);
  if (c) n.className = c;
  if (x != null) n.textContent = x;
  return n;
};
var clear = (node) => {
  if (node) node.textContent = "";
  return node;
};
function optionCard(card, opts = {}) {
  const drafted = !!opts.drafted && !opts.selected;
  const c = el("button", "opt" + (card.recommended && !drafted ? " rec" : "") + (drafted ? " draft" : "") + (opts.selected ? " sel" : ""));
  if (drafted) c.append(el("span", "rb draft", "CAST'S PICK"));
  else if (card.recommended && !opts.selected) c.append(el("span", "rb", "RECOMMENDED"));
  if (opts.selected) c.append(el("span", "rb sel", "LOCKED \u2713"));
  c.append(el("div", "nm", card.title));
  if (card.subtitle) c.append(el("div", "ni", card.subtitle));
  if (card.body) c.append(el("div", "an", card.body));
  if (card.bullets?.length) {
    const ul = el("ul", "bul");
    for (const b of card.bullets) ul.append(el("li", null, b));
    c.append(ul);
  }
  if (card.palette?.length) {
    const p = el("div", "pal");
    for (const s of card.palette) {
      const sw = el("span", "sw");
      sw.style.background = s.hex;
      sw.title = s.name || s.hex;
      p.append(sw);
    }
    c.append(p);
  }
  if (card.chips?.length) {
    const row = el("div", "ochips");
    for (const ch of card.chips) row.append(el("span", "oc", ch));
    c.append(row);
  }
  if (card.meta?.length) {
    const m = el("div", "ometa");
    for (const kv of card.meta) {
      const r = el("span");
      r.append(el("b", null, kv.label + " "), document.createTextNode(kv.value));
      m.append(r);
    }
    c.append(m);
  }
  c.append(el("div", "use", opts.selected ? "Locked" : drafted ? opts.draftLabel || "Confirm this \u2713" : opts.pickLabel || "Lock this \u2192"));
  if (opts.onPick) c.onclick = () => opts.onPick(card);
  return c;
}
function optionGrid(cards, opts = {}) {
  const box = el("div", "opts");
  if (!cards?.length) {
    box.append(el("div", "empty-note", opts.empty || "No options yet."));
    return box;
  }
  for (const card of cards) box.append(optionCard(card, { ...opts, selected: opts.isSelected?.(card), drafted: opts.isDrafted?.(card) }));
  return box;
}
function steer({ placeholder, value = "", cta = "Generate", onSubmit, chips = [], onChip }) {
  const wrap = el("div", "steerblock");
  const row = el("div", "steerrow");
  row.append(el("span", "spark", "\u2728"));
  const input = Object.assign(el("input"), { type: "text", placeholder, value });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onSubmit(input.value.trim());
  });
  const btn = el("button", "genbtn", cta);
  btn.onclick = () => onSubmit(input.value.trim());
  row.append(input, btn);
  wrap.append(row);
  if (chips.length) {
    const cr = el("div", "chips");
    for (const ch of chips) {
      const b = el("button", "chip");
      b.append(el("span", "s", "\u2728"), document.createTextNode(ch));
      b.onclick = () => {
        input.value = ch;
        onChip ? onChip(ch) : onSubmit(ch);
      };
      cr.append(b);
    }
    wrap.append(cr);
  }
  wrap._input = input;
  wrap._btn = btn;
  return wrap;
}
function renderStepper(box, account, onGo) {
  clear(box);
  const reach = reachableStage(account);
  const reachIdx = stageIndex(reach);
  const line = el("div", "steps");
  STAGES.forEach((s, i) => {
    const done = stageReady(account, s.id);
    const reachable = i <= reachIdx;
    const on = account.stage === s.id;
    const step = el("button", "step" + (on ? " on" : "") + (done ? " done" : "") + (reachable ? "" : " lock"));
    const dot = el("span", "sdot", done ? "\u2713" : String(i + 1));
    const tx = el("span", "stx");
    tx.append(el("span", "sn", s.title), el("span", "sk", s.kicker));
    step.append(dot, tx);
    if (reachable) step.onclick = () => onGo(s.id);
    line.append(step);
    if (i < STAGES.length - 1) {
      const c = el("span", "sconn" + (done ? " done" : ""));
      line.append(c);
    }
  });
  box.append(line);
  const bar = el("div", "pbar");
  const fill = el("i");
  fill.style.width = Math.round(progress(account) * 100) + "%";
  bar.append(fill);
  box.append(bar);
}
function gateBar(account, stageId, onContinue) {
  const stage = STAGES.find((s) => s.id === stageId);
  const idx = stageIndex(stageId);
  const next = STAGES[idx + 1];
  const ready = stageReady(account, stageId);
  const bar = el("div", "gate" + (ready ? " ready" : ""));
  const msg = el("div", "gmsg");
  msg.append(el("span", "gk", ready ? "Gate cleared" : "To continue"), document.createTextNode(ready ? next ? `Ready for ${next.title}` : "Pipeline complete" : advanceHint(stage)));
  bar.append(msg);
  if (next) {
    const btn = el("button", "primary", `Continue to ${next.title} \u2192`);
    btn.disabled = !ready;
    btn.onclick = () => onContinue(next.id);
    bar.append(btn);
  } else if (ready) {
    bar.append(el("span", "saved show", "Account live \u2713"));
  }
  return bar;
}
function advanceHint(stage) {
  return { "brief locked": "Give Cast one thing \u2014 a line, an account, or a photo.", "all facets locked": "Lock a choice for every facet.", "face + setting approved": "Approve the face and the setting.", "\u22651 slot approved": "Approve at least one calendar slot.", "\u22651 script approved": "Approve at least one script.", "done": "" }[stage.advance] || stage.advance;
}
function stageHead(stageId) {
  const stage = STAGES.find((s) => s.id === stageId);
  const head = el("div", "stagehead");
  head.append(el("span", "eyebrow", stage.kicker), el("h2", null, stage.title), el("p", "lead", stage.blurb));
  return head;
}
function loadingCard(label) {
  const c = el("div", "opt load");
  c.append(el("div", "scan"), el("div", "an", label || "thinking\u2026"));
  return c;
}

// src/cast/stages.js
var reelTimer = null;
function stopReel() {
  if (reelTimer) {
    clearInterval(reelTimer);
    reelTimer = null;
  }
}
var camStream = null;
function stopCam() {
  if (camStream) {
    for (const t of camStream.getTracks()) t.stop();
    camStream = null;
  }
}
var entryMode = "describe";
function renderReference(root, ctx) {
  const a = ctx.account, r = a.reference;
  if (!r.locked) return renderEntry(root, ctx);
  root.append(stageHead("reference"));
  const card = el("div", "card");
  card.append(el("span", "eyebrow", "The brief"));
  if (r.fromPhoto && a.assets?.face?.url) {
    const ph = el("div", "briefphoto");
    ph.append(Object.assign(el("img"), { src: a.assets.face.url, alt: "The uploaded photo" }));
    ph.append(el("span", "empty-note", "Started from this photo \u2014 it's locked as the face."));
    card.append(ph);
  }
  const brief = steer({
    placeholder: "Describe the account in a line \u2014 'a plain-spoken skincare creator in Lisbon'",
    value: r.brief,
    cta: "Ground it",
    chips: ["a Gen-Z skincare creator in Lisbon", "a streetwear sneakerhead in Seoul", "a cozy home-cook mum", "a no-BS fitness coach", "a minimalist interiors creator"],
    onSubmit: (v) => {
      r.brief = v;
      ctx.save();
      ground(v);
    },
    onChip: (v) => {
      r.brief = v;
      ctx.save();
      ctx.rerender();
    }
  });
  card.append(brief);
  const g2 = el("div", "grid2");
  g2.style.marginTop = "14px";
  g2.append(field("Niche", r.niche, "sustainable skincare", (v) => {
    r.niche = v;
    ctx.save();
  }));
  g2.append(field("Mood / direction", r.moodNotes, "warm, unhurried, label-reading", (v) => {
    r.moodNotes = v;
    ctx.save();
  }));
  card.append(g2);
  root.append(card);
  const insp = el("div", "card");
  insp.append(el("span", "eyebrow", "Reference accounts"));
  insp.append(el("p", "empty-note", "Add a few Instagram accounts whose feel you admire. A research agent reads the niche around them and grounds every option Cast proposes."));
  const list = el("div", "insplist");
  (r.inspirations || []).forEach((ins, i) => {
    const chip = el("span", "insp");
    chip.append(el("b", null, ins.handle));
    const x = el("button", "ix", "\xD7");
    x.onclick = () => {
      r.inspirations.splice(i, 1);
      ctx.save();
      ctx.rerender();
    };
    chip.append(x);
    list.append(chip);
  });
  const add = steer({ placeholder: "@handle or a note about an account you admire", cta: "Add", onSubmit: (v) => {
    if (!v) return;
    r.inspirations = r.inspirations || [];
    r.inspirations.push({ handle: v.startsWith("@") || v.length < 24 ? v : v, note: "" });
    ctx.save();
    ctx.rerender();
  } });
  insp.append(list, add);
  root.append(insp);
  root.append(gateBar(a, "reference", ctx.go));
  const confirm = el("div", "confirmrow");
  const btn = el("button", r.locked ? "ghost" : "primary", r.locked ? "Brief locked \u2713 \u2014 edit above to re-ground" : "Confirm brief & begin \u2192");
  const cerr = el("span", "note danger");
  cerr.hidden = true;
  btn.onclick = () => {
    if (!r.brief && !r.niche) {
      cerr.textContent = "Give Cast a brief or a niche to ground the account.";
      cerr.hidden = false;
      return;
    }
    cerr.hidden = true;
    r.locked = true;
    ctx.save();
    ctx.go("foundation");
  };
  confirm.append(btn, cerr);
  root.append(confirm);
  async function ground(v) {
    if (ctx.mock) {
      r.niche = r.niche || deriveNiche(v);
      r.moodNotes = r.moodNotes || "warm, plain-spoken, considered";
      ctx.rerender();
      return;
    }
    if (!ctx.relay) return;
    brief._btn.disabled = true;
    brief._btn.textContent = "Reading the niche\u2026";
    try {
      const obj = await streamJsonObject(
        ctx.relay,
        `A founder wants to build an Instagram account: "${v}".${r.inspirations?.length ? " Reference accounts they admire: " + r.inspirations.map((i) => i.handle).join(", ") + "." : ""} Use WebSearch to understand this corner of Instagram. Reply with ONLY JSON {"niche": "...", "mood": "one line on tone & aesthetic"}.`
      );
      if (obj) {
        r.niche = obj.niche || r.niche;
        r.moodNotes = obj.mood || r.moodNotes;
      }
    } catch {
    }
    ctx.rerender();
  }
}
function renderEntry(root, ctx) {
  const r = ctx.account.reference;
  const card = el("div", "card entry");
  card.append(el("span", "eyebrow", "Start"));
  card.append(el("h2", "et", "Give Cast one thing."));
  card.append(el("p", "ed", "A line, an account you admire, or a photo. Cast makes everything else inside \u2014 the person, the voice, the world, the plan \u2014 and you approve every step."));
  const seg = el("div", "modes");
  for (const [id, label] of [["describe", "\u270F\uFE0F A line"], ["reference", "\uFF20 An account"], ["photo", "\u{1F4F7} A photo"]]) {
    const b = el("button", "mode" + (entryMode === id ? " on" : ""), label);
    b.onclick = () => {
      entryMode = id;
      ctx.rerender();
    };
    seg.append(b);
  }
  card.append(seg);
  if (entryMode === "describe") {
    const chips = ["a Gen-Z skincare creator in Lisbon", "a streetwear sneakerhead in Seoul", "a cozy home-cook mum", "a no-BS fitness coach", "a minimalist interiors creator"];
    const b = ctx.account.brand || ctx.brand;
    const derived = b ? `an independent creator making content for ${b.name}${b.data?.positioning || b.data?.tagline ? " \u2014 " + (b.data.positioning || b.data.tagline) : ""}` : "";
    card.append(steer({
      placeholder: "Describe the account in a line \u2014 'a plain-spoken skincare creator in Lisbon'",
      value: r.brief || derived || chips[0],
      cta: "\u2728 Make it \u2192",
      chips,
      onSubmit: (v) => {
        if (v) begin(ctx, { brief: v });
      }
    }));
  } else if (entryMode === "reference") {
    card.append(steer({
      placeholder: "@handle of an account whose feel you admire",
      cta: "\u2728 Make it \u2192",
      chips: ["@dailyoriginalvids", "@softlife.journal", "@minimal.kitchen"],
      onSubmit: (v) => {
        if (v) begin(ctx, { handle: v });
      }
    }));
  } else {
    const line = Object.assign(el("input"), { type: "text", placeholder: "Who is this? \u2014 'Sameep \u2014 I talk about AI apps and how to use them'", value: r.brief || "" });
    const lrow = el("div", "steerrow entryline");
    lrow.append(el("span", "spark", "\u2728"), line);
    card.append(lrow);
    const well = el("div", "camwell");
    const idle = el("div", "camidle");
    const openBtn = el("button", "genbtn", "\u{1F4F7} Open the camera");
    idle.append(openBtn, el("span", "dd", "Click a photo of the person \u2014 their face becomes the locked identity, and every post is shot on it."));
    const video = Object.assign(el("video"), { autoplay: true, playsInline: true, muted: true });
    const shutter = el("button", "shutter");
    shutter.title = "Click the photo";
    well.append(idle, video, shutter);
    const start = (photo) => begin(ctx, { photo, brief: line.value.trim() });
    openBtn.onclick = async () => {
      try {
        camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 } }, audio: false });
        video.srcObject = camStream;
        well.classList.add("live");
      } catch {
        openBtn.textContent = "Camera unavailable \u2014 upload below";
        openBtn.disabled = true;
      }
    };
    shutter.onclick = () => {
      const s = Math.min(video.videoWidth, video.videoHeight);
      if (!s) return;
      const c = document.createElement("canvas");
      c.width = c.height = Math.min(720, s);
      c.getContext("2d").drawImage(video, (video.videoWidth - s) / 2, (video.videoHeight - s) / 2, s, s, 0, 0, c.width, c.height);
      const shot = c.toDataURL("image/png");
      stopCam();
      start(shot);
    };
    const file = Object.assign(el("input"), { type: "file", accept: "image/*", hidden: true });
    const take = async (f) => {
      if (!f) return;
      const raw = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = rej;
        fr.readAsDataURL(f);
      });
      start(await downscale(raw));
    };
    file.addEventListener("change", () => take(file.files?.[0]));
    well.addEventListener("dragover", (e) => e.preventDefault());
    well.addEventListener("drop", (e) => {
      e.preventDefault();
      take(e.dataTransfer?.files?.[0]);
    });
    const up = el("div", "uploadrow");
    const ub = el("button", null, "upload a photo instead");
    ub.onclick = () => file.click();
    up.append(document.createTextNode("or "), ub, document.createTextNode(" \xB7 or drag one onto the frame"));
    card.append(well, up, file);
  }
  root.append(card);
}
function begin(ctx, { brief, handle, photo }) {
  const a = ctx.account, r = a.reference;
  if (brief) r.brief = brief;
  if (handle) {
    r.inspirations = [{ handle, note: "" }];
    r.brief = r.brief || `an account with the feel of ${handle}`;
  }
  if (photo) {
    a.assets.face = { url: photo, status: "done", approved: true, source: "upload" };
    r.fromPhoto = true;
  }
  r.locked = true;
  ctx.save();
  ctx.go("foundation");
  groundInBackground(ctx);
}
async function groundInBackground(ctx) {
  const a = ctx.account, r = a.reference;
  if (r.niche && r.moodNotes) return;
  if (ctx.mock) {
    r.niche = r.niche || deriveNiche(r.brief);
    r.moodNotes = r.moodNotes || "warm, plain-spoken, considered";
    ctx.save();
    ctx.rerender();
    return;
  }
  if (!ctx.relay) return;
  try {
    const attachments = r.fromPhoto && a.assets.face?.url ? [{ handle: "face", filename: "face.png", contentType: "image/png", dataUrl: a.assets.face.url }] : void 0;
    const ask = attachments ? `A founder photographed the person their new Instagram account is built around (attached as "face").${r.brief ? ` The founder says: "${r.brief}".` : ""} Study the photo. ` : `A founder wants to build an Instagram account: "${r.brief}".${r.inspirations?.length ? " Reference accounts they admire: " + r.inspirations.map((i) => i.handle).join(", ") + "." : ""} Use WebSearch to understand this corner of Instagram. `;
    const obj = await streamJsonObject(ctx.relay, ask + `Reply with ONLY JSON {"brief": "one line for the account", "niche": "...", "mood": "one line on tone & aesthetic"}.`, { attachments });
    if (obj) {
      if (!r.brief) r.brief = obj.brief || "";
      r.niche = obj.niche || r.niche;
      r.moodNotes = obj.mood || r.moodNotes;
      ctx.save();
      ctx.rerender();
    }
  } catch {
  }
}
function renderFoundation(root, ctx) {
  const a = ctx.account;
  root.append(stageHead("foundation"));
  queueMicrotask(() => {
    for (const facet of FACETS) {
      if (!a.foundation.locks[facet.id] && !a.foundation.cards[facet.id] && !ctx.loading.has(facet.id) && facetUnlocked(a, facet.id)) runFacet(facet, ctx);
    }
  });
  for (const facet of FACETS) root.append(facetCard(facet, ctx));
  root.append(gateBar(a, "foundation", ctx.go));
}
function facetCard(facet, ctx) {
  const a = ctx.account, fnd = a.foundation;
  const status = facetStatus(a, facet.id, ctx.loading);
  const drafted = !!fnd.auto[facet.id] && !!fnd.locks[facet.id];
  const card = el("div", "card facet " + status);
  const head = el("div", "fhead");
  const title = el("div", "ft");
  title.append(el("span", "fname", facet.title), el("span", "fstatus " + (drafted ? "drafted" : status), drafted ? "drafted" : status));
  head.append(title);
  const lock = fnd.locks[facet.id];
  if (facetUnlocked(a, facet.id)) {
    const gen2 = el("button", "mini", fnd.cards[facet.id]?.length || lock ? "\u2728 Regenerate" : "\u2728 Generate options");
    gen2.disabled = status === "researching";
    gen2.onclick = () => runFacet(facet, ctx);
    head.append(gen2);
  }
  card.append(head);
  card.append(el("div", "fblurb", facet.blurb));
  if (status === "blocked") {
    card.append(el("div", "empty-note", `Locks first: ${facet.deps.map((d) => facetAt(d).title).join(", ")}.`));
    return card;
  }
  if (status === "researching") {
    const g = el("div", "opts");
    for (let i = 0; i < facet.count; i++) g.append(loadingCard(facet.web ? "researching\u2026" : "thinking\u2026"));
    card.append(g);
    return card;
  }
  const genCards = fnd.cards[facet.id];
  let cards = genCards || [];
  for (const c of [lock, ...fnd.more[facet.id] || []].filter(Boolean)) if (!cards.some((x) => x.id === c.id)) cards = [c, ...cards];
  if (!cards.length) {
    const offline = !ctx.mock && !ctx.relay;
    card.append(el("div", "empty-note", offline ? "Switchboard disconnected \u2014 reconnect from the chip to keep generating." : genCards ? "Nothing came back \u2014 steer below and regenerate, or write your own." : "Generate options to choose a direction."));
    card.append(steerRow(facet, ctx, status));
    return card;
  }
  const picked = new Set([lock?.id, ...(fnd.more[facet.id] || []).map((c) => c.id)].filter(Boolean));
  const grid = optionGrid(cards, {
    // accent + LOCKED only for a human's own pick; Cast's autopilot pick stays a neutral draft.
    isSelected: (c) => picked.has(c.id) && !drafted,
    isDrafted: (c) => picked.has(c.id) && drafted,
    pickLabel: facet.select === "many" ? "Add pillar +" : "Lock this \u2192",
    draftLabel: facet.select === "many" ? "Drafted \xB7 tap to drop" : "Confirm this \u2713",
    onPick: (c) => {
      relock(a, facet.id, c);
      ctx.save();
      ctx.rerender();
    }
  });
  card.append(grid);
  card.append(steerRow(facet, ctx, status));
  if (lock && drafted) card.append(draftBar(facet, ctx));
  if (facet.select === "many" && picked.size) card.append(el("div", "note", `${picked.size} pillar${picked.size === 1 ? "" : "s"} picked \u2014 lock 3-4 for a strong calendar.`));
  return card;
}
function draftBar(facet, ctx) {
  const a = ctx.account, fnd = a.foundation;
  const bar = el("div", "draftbar");
  const t = el("div", "dbt");
  t.append(el("b", null, "\u2728 Cast's pick \u2014 drafted, not locked."), document.createTextNode(" Confirm it, or pick another card above, steer the options, or write your own."));
  const ok = el("button", "okbtn", facet.select === "many" ? "Confirm these \u2713" : "Confirm this \u2713");
  ok.onclick = () => {
    delete fnd.auto[facet.id];
    ctx.save();
    ctx.rerender();
  };
  bar.append(t, ok);
  return bar;
}
function steerRow(facet, ctx, status) {
  const a = ctx.account, fnd = a.foundation;
  const steers = fnd.steers || (fnd.steers = {});
  const row = el("div", "steerrow fsteer");
  row.append(el("span", "spark", "\u270E"));
  const inp = Object.assign(el("input"), { type: "text", placeholder: facet.steer || "Steer the options, or write your own\u2026", value: steers[facet.id] || "" });
  inp.addEventListener("input", () => {
    steers[facet.id] = inp.value;
    ctx.save();
  });
  const reg = el("button", "mini", "\u21BB Steer options");
  reg.disabled = status === "researching";
  reg.onclick = () => {
    steers[facet.id] = inp.value.trim();
    ctx.save();
    runFacet(facet, ctx);
  };
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !reg.disabled) reg.onclick();
  });
  const mine = el("button", "genbtn", facet.select === "many" ? "Add mine +" : "Lock mine \u2192");
  mine.onclick = () => {
    const v = inp.value.trim();
    if (!v) {
      inp.focus();
      return;
    }
    relock(a, facet.id, ownCard(v));
    steers[facet.id] = "";
    ctx.save();
    ctx.rerender();
  };
  row.append(inp, reg, mine);
  return row;
}
function ownCard(v) {
  const short = v.length <= 60;
  return { id: newId(), title: short ? v : v.slice(0, 57) + "\u2026", body: short ? void 0 : v, chips: ["yours"], custom: true };
}
function relock(a, facetId, card) {
  const fnd = a.foundation;
  for (const d of lockFacet(a, facetId, card)) {
    if (fnd.auto[d] && !fnd.cards[d]) {
      delete fnd.locks[d];
      delete fnd.more[d];
      delete fnd.auto[d];
    }
  }
}
async function runFacet(facet, ctx) {
  const a = ctx.account;
  if (!ctx.mock && !ctx.relay) return;
  ctx.loading.add(facet.id);
  ctx.rerender();
  try {
    const cards = ctx.mock ? mockFacet(facet, a) : await generateCards(ctx.relay, facetPrompt(a, facet), { web: facet.web });
    if (facet.select === "one" && cards.length && !cards.some((c) => c.recommended)) cards[0].recommended = true;
    a.foundation.cards[facet.id] = cards;
    autoLock(facet, ctx);
  } catch (e) {
    console.warn("[cast] facet generation failed:", facet.id, e);
    a.foundation.cards[facet.id] = a.foundation.cards[facet.id] || [];
  }
  ctx.loading.delete(facet.id);
  ctx.save();
  ctx.rerender();
}
function autoLock(facet, ctx) {
  const a = ctx.account, fnd = a.foundation;
  const cards = fnd.cards[facet.id] || [];
  const humanLocked = fnd.locks[facet.id] && !fnd.auto[facet.id];
  if (humanLocked || !cards.length) return;
  if (fnd.auto[facet.id]) {
    delete fnd.locks[facet.id];
    delete fnd.more[facet.id];
  }
  if (facet.select === "many") for (const c of cards.slice(0, 3)) relock(a, facet.id, c);
  else relock(a, facet.id, cards.find((c) => c.recommended) || cards[0]);
  fnd.auto[facet.id] = true;
}
function renderAssets(root, ctx) {
  const a = ctx.account;
  root.append(stageHead("assets"));
  const vals = facetValues(a);
  queueMicrotask(() => {
    for (const spec of ASSETS) if (spec.gate && spec.one && !a.assets[spec.id]) genAsset(spec, spec.seed(vals), ctx);
  });
  for (const spec of ASSETS) root.append(assetCard(spec, vals, ctx));
  root.append(gateBar(a, "assets", ctx.go));
}
function assetCard(spec, vals, ctx) {
  const a = ctx.account;
  const card = el("div", "card");
  const head = el("div", "ah");
  head.append(el("span", "eyebrow", spec.title + (spec.gate ? "" : " \xB7 optional")));
  card.append(head);
  const seed = spec.seed(vals);
  if (spec.one) {
    const cur = a.assets[spec.id];
    const box = el("div", "assetone");
    const well = el("div", "assetwell" + (cur?.status === "gen" ? " load" : ""));
    if (cur?.status === "gen") {
      if (cur.url) well.append(Object.assign(el("img"), { src: cur.url }));
      well.append(el("div", "scan"));
    } else if (cur?.url) well.append(Object.assign(el("img"), { src: cur.url }));
    else well.append(el("span", "ph", "\u2728"));
    box.append(well);
    const side = el("div", "assetside");
    side.append(el("div", "d", cur?.url ? cur.approved ? "Approved \u2014 used in every shot." : "Approve to lock it into the persona's world, or regenerate." : "Generate from your locked foundation."));
    const btns = el("div", "facebtns");
    const g = el("button", "genbtn", cur?.url ? "\u21BB Regenerate" : "\u2728 Generate");
    g.disabled = cur?.status === "gen";
    g.onclick = () => genAsset(spec, seed, ctx);
    btns.append(g);
    if (cur?.url && !cur.approved && cur.status !== "gen") {
      const ok = el("button", "okbtn", "Approve \u2713");
      ok.onclick = () => {
        cur.approved = true;
        ctx.save();
        ctx.rerender();
      };
      btns.append(ok);
    }
    if (cur?.approved) btns.append(el("span", "saved show", "Approved \u2713"));
    side.append(btns);
    if (cur?.error) side.append(el("div", "note danger", cur.error));
    box.append(side);
    card.append(box);
  } else {
    const list = a.assets[spec.id] || (a.assets[spec.id] = []);
    const tiles = el("div", "tiles");
    list.forEach((asset, i) => {
      const tile = el("div", "tile" + (asset.status === "gen" ? " load" : "") + (asset.approved ? " ok" : ""));
      if (asset.status === "gen") tile.append(el("div", "scan"));
      else if (!asset.url) {
        const ph = el("div", "img");
        tile.append(ph, el("div", "lb", "failed \u2014 \xD7 to remove"));
      } else {
        tile.append(Object.assign(el("img", "img"), { src: asset.url }));
        tile.append(el("div", "lb", asset.name || spec.title));
      }
      if (asset.url && !asset.approved) {
        const ok = el("button", "tok", "\u2713");
        ok.title = "Approve";
        ok.onclick = () => {
          asset.approved = true;
          ctx.save();
          ctx.rerender();
        };
        tile.append(ok);
      }
      const x = el("button", "x", "\xD7");
      x.onclick = () => {
        list.splice(i, 1);
        ctx.save();
        ctx.rerender();
      };
      tile.append(x);
      tiles.append(tile);
    });
    const add = el("div", "tile empty", "\u2728 Generate");
    add.onclick = () => genAsset(spec, seed, ctx);
    tiles.append(add);
    card.append(tiles);
  }
  return card;
}
async function genAsset(spec, seed, ctx) {
  const a = ctx.account;
  if (!ctx.mock && !ctx.relay) return;
  const prev = spec.one ? a.assets[spec.id] : null;
  const rec = spec.one ? { ...prev || {}, id: newId(), status: "gen", approved: false, prompt: seed, name: spec.title, error: null } : { id: newId(), status: "gen", approved: false, prompt: seed, name: spec.title };
  if (spec.one) a.assets[spec.id] = rec;
  else (a.assets[spec.id] = a.assets[spec.id] || []).push(rec);
  ctx.rerender();
  const bseed = brandStyle(a) ? `${seed}, ${brandStyle(a)}` : seed;
  let url = null;
  try {
    if (ctx.mock) {
      await wait(800);
      url = svgTile(spec.title, ...COLORS[Math.floor(Math.random() * COLORS.length)]);
    } else if (spec.id === "face") url = await generateImage(ctx.relay, bseed, "1:1", MODELS.face);
    else if (spec.id === "setting") url = await generateImage(ctx.relay, bseed, "9:16", MODELS.setting);
    else {
      const refs = a.assets.face?.url ? [{ handle: "face", filename: "face.png", url: a.assets.face.url }] : [];
      url = refs.length ? await generateOnModel(ctx.relay, bseed, "1:1", refs, null, MODELS.shot) : await generateImage(ctx.relay, bseed, "1:1", MODELS.shot);
    }
  } catch {
    url = null;
  }
  if (url) {
    rec.url = url;
    rec.status = "done";
    rec.approved = false;
    rec.error = null;
  } else if (spec.one && prev?.url) a.assets[spec.id] = { ...prev, error: "Regeneration failed \u2014 kept the previous image." };
  else {
    rec.status = "fail";
    if (spec.one) rec.error = "Generation failed \u2014 try again.";
  }
  ctx.save();
  ctx.rerender();
}
function renderCalendar(root, ctx) {
  const a = ctx.account;
  root.append(stageHead("calendar"));
  const pillars = pillarList(a);
  if (a.calendar._proposed === void 0 && !(a.calendar.slots || []).length && !ctx.loading.has("plan")) queueMicrotask(() => proposePlan(ctx));
  const research = el("div", "card");
  research.append(el("span", "eyebrow", "Research \u2192 plan"));
  research.append(el("p", "empty-note", `A research agent proposes dated posts across your ${pillars.length} pillar${pillars.length === 1 ? "" : "s"}, using what's trending now. Approve the ones you want.`));
  const btn = el("button", "primary", a.calendar._proposed?.length ? "\u2728 Propose more" : "\u2728 Propose a content plan");
  btn.disabled = ctx.loading.has("plan");
  btn.onclick = () => proposePlan(ctx);
  research.append(btn);
  const props = el("div", "topics");
  props.id = "planProps";
  if (ctx.loading.has("plan")) for (let i = 0; i < 3; i++) props.append(loadingCard("researching the niche\u2026"));
  (a.calendar._proposed || []).forEach((tp) => props.append(topicRow(tp, ctx)));
  research.append(props);
  root.append(research);
  const cal = el("div", "card");
  cal.append(el("span", "eyebrow", "Content calendar"));
  const slots = (a.calendar.slots || []).filter((s) => s.approved).sort((x, y) => (x.date || "").localeCompare(y.date || ""));
  if (!slots.length) cal.append(el("div", "empty-note", "Nothing approved yet. Propose a plan and approve slots into the calendar."));
  else for (const s of slots) cal.append(slotRow(s, ctx));
  root.append(cal);
  root.append(gateBar(a, "calendar", ctx.go));
}
function topicRow(tp, ctx) {
  const a = ctx.account;
  const row = el("div", "topic");
  const body = el("div", "body");
  body.append(el("div", "tt", tp.title));
  if (tp.angle) body.append(el("div", "td", tp.angle));
  const tags = el("div", null);
  if (tp.pillar) tags.append(el("span", "tag", tp.pillar));
  if (tp.source) tags.append(el("span", "tag alt", tp.source));
  body.append(tags);
  const add = el("button", "plus", "\uFF0B Approve");
  add.onclick = () => {
    a.calendar.slots.push({ id: newId(), date: tp.date || nextDate(a), pillar: tp.pillar, title: tp.title, angle: tp.angle, source: tp.source, approved: true, status: "planned" });
    a.calendar._proposed = (a.calendar._proposed || []).filter((x) => x !== tp);
    ctx.save();
    ctx.rerender();
  };
  row.append(body, add);
  return row;
}
function slotRow(s, ctx) {
  const a = ctx.account;
  const slot = el("div", "slot");
  const when = el("div", "when");
  const d = (s.date || "").split("-");
  when.append(el("div", null, monthShort(d[1])), el("div", "d", d[2] || "1"));
  slot.append(when);
  const what = el("div", "what");
  what.append(el("div", "tt", s.title));
  what.append(el("div", "meta", `${s.pillar || "post"}${s.angle ? " \xB7 " + s.angle.slice(0, 54) : ""}`));
  slot.append(what);
  const x = el("button", "x", "\xD7");
  x.onclick = () => {
    a.calendar.slots = a.calendar.slots.filter((y) => y.id !== s.id);
    ctx.save();
    ctx.rerender();
  };
  slot.append(x);
  return slot;
}
async function proposePlan(ctx) {
  const a = ctx.account;
  if (!ctx.mock && !ctx.relay) return;
  ctx.loading.add("plan");
  ctx.rerender();
  try {
    const pillars = pillarList(a).map((p) => p.title);
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const props = ctx.mock ? mockPlan(a) : await generateCards(
      ctx.relay,
      `You are a social strategist for ${personaName(a)}, an account in ${a.reference.niche || "its niche"} (voice: ${a.foundation.locks.voice?.title || "n/a"}). ` + (brandLine(a) ? brandLine(a) + " Weave the brand in naturally where it fits, never forced. " : "") + `Pillars: ${pillars.join(", ") || "general"}. Use WebSearch for what's trending right now. Propose 6 specific posts spread over the next few weeks. Reply with ONLY a JSON array of {"title","angle","pillar","source","date":"YYYY-MM-DD"} \u2014 real future dates within 3 weeks starting from ${today}.`,
      { web: true }
    );
    a.calendar._proposed = [...a.calendar._proposed || [], ...props.map((c) => ({ title: c.title, angle: c.body || c.angle, pillar: c.chips?.[0] || c.pillar, source: c.subtitle || c.source, date: c.date }))];
  } catch {
    a.calendar._proposed = a.calendar._proposed || [];
  }
  ctx.loading.delete("plan");
  ctx.save();
  ctx.rerender();
}
function renderScripts(root, ctx) {
  const a = ctx.account;
  root.append(stageHead("scripts"));
  const slots = (a.calendar.slots || []).filter((s) => s.approved);
  queueMicrotask(() => {
    for (const s of slots) if (!(s.id in a.scripts) && !ctx.loading.has("script:" + s.id)) writeScript(s, ctx);
  });
  if (!slots.length) root.append(el("div", "empty-note", "Approve calendar slots first \u2014 each becomes a script here."));
  for (const s of slots) root.append(scriptCard(s, ctx));
  root.append(gateBar(a, "scripts", ctx.go));
}
function scriptCard(slot, ctx) {
  const a = ctx.account;
  const sc = a.scripts[slot.id];
  const card = el("div", "card");
  const head = el("div", "ah");
  head.append(el("span", "eyebrow", slot.title));
  const g = el("button", "mini", sc ? "\u21BB Rewrite" : "\u2728 Write script");
  g.disabled = ctx.loading.has("script:" + slot.id);
  g.onclick = () => writeScript(slot, ctx);
  head.append(g);
  card.append(head);
  if (slot.angle) card.append(el("div", "fblurb", slot.angle));
  if (ctx.loading.has("script:" + slot.id)) {
    card.append(loadingCard("writing\u2026"));
    return card;
  }
  if (!sc) {
    card.append(el("div", "empty-note", "No script yet."));
    return card;
  }
  const beats = el("div", null);
  sc.beats.forEach((b, i) => {
    const row = el("div", "beat");
    row.append(el("div", "n", String(i + 1)));
    const body = el("div", "b");
    body.append(el("div", "shot", b.shot || "\u2014"));
    if (b.line) body.append(el("div", "line", b.line));
    row.append(body);
    beats.append(row);
  });
  card.append(beats);
  const foot = el("div", "confirmrow");
  const ok = el("button", sc.approved ? "ghost" : "primary", sc.approved ? "Script approved \u2713" : "Approve script \u2192");
  ok.onclick = () => {
    sc.approved = !sc.approved;
    ctx.save();
    ctx.rerender();
  };
  foot.append(ok);
  card.append(foot);
  return card;
}
async function writeScript(slot, ctx) {
  const a = ctx.account;
  if (!ctx.mock && !ctx.relay) return;
  ctx.loading.add("script:" + slot.id);
  ctx.rerender();
  try {
    const beats = ctx.mock ? mockScript(a, slot) : await generateCards(
      ctx.relay,
      `Write a short-form vertical video script for ${personaName(a)} (voice: ${a.foundation.locks.voice?.title || "natural"}). ` + (brandLine(a) ? brandLine(a) + " If the brand fits the topic, feature it authentically; otherwise leave it out. " : "") + `Topic: ${slot.title}. ${slot.angle || ""}. 4 beats: hook, two middles, CTA. Each beat: {"shot": what we see on-location, "line": what they say in their voice}. Reply with ONLY a JSON array of {"shot","line"}.`
    ).then((cards) => cards.map((c) => ({ shot: c.title, line: c.body || "" })));
    a.scripts[slot.id] = { beats, approved: false, status: "written" };
    const prevProd = a.productions?.[slot.id];
    if (prevProd) {
      a.productions[slot.id] = {
        ...prevProd,
        shots: beats.map((b, i) => {
          const o = prevProd.shots?.[i];
          return o && o.desc === b.shot ? { ...o, line: b.line } : { id: newId(), desc: b.shot, line: b.line, url: null, status: "idle", approved: false };
        }),
        stitchedUrl: null,
        approved: false,
        status: "idle",
        error: null
      };
    }
  } catch {
    if (!(slot.id in a.scripts)) a.scripts[slot.id] = null;
  }
  ctx.loading.delete("script:" + slot.id);
  ctx.save();
  ctx.rerender();
}
function renderProduce(root, ctx) {
  const a = ctx.account;
  root.append(stageHead("produce"));
  const slots = (a.calendar.slots || []).filter((s) => s.approved && a.scripts[s.id]?.approved);
  if (!slots.length) root.append(el("div", "empty-note", "Approve a script first \u2014 approved scripts become productions here."));
  for (const s of slots) root.append(produceCard(s, ctx));
  root.append(gateBar(a, "produce", ctx.go));
}
function produceCard(slot, ctx) {
  const a = ctx.account;
  const sc = a.scripts[slot.id];
  const prod = a.productions[slot.id] || (a.productions[slot.id] = { shots: sc.beats.map((b, i) => ({ id: newId(), desc: b.shot, line: b.line, url: null, status: "idle", approved: false })), stitchedUrl: null, approved: false, status: "idle" });
  const card = el("div", "card");
  card.append(el("span", "eyebrow", slot.title));
  card.append(el("div", "fblurb", "Storyboard \u2014 one still per beat (nano-banana keyframes). Approve them, then render each into a real video clip on your locked face, narrated beat by beat."));
  const strip = el("div", "filmstrip");
  prod.shots.forEach((shot, i) => {
    const frame = el("div", "frame" + (shot.status === "gen" ? " load" : "") + (shot.approved ? " ok" : ""));
    frame.append(el("div", "idx", String(i + 1)));
    if (shot.status === "gen") frame.append(el("div", "scan"));
    else if (shot.url) frame.append(Object.assign(el("img", "img"), { src: shot.url, alt: shot.desc }));
    else {
      const ph = el("div", "img");
      frame.append(ph);
    }
    frame.append(el("div", "cap", (shot.desc || "").slice(0, 42)));
    const bar = el("div", "framebar");
    const g = el("button", "fmini", shot.url ? "\u21BB" : "\u2728");
    g.title = shot.url ? "Regenerate" : "Generate";
    g.onclick = () => genShot(slot, i, ctx);
    bar.append(g);
    if (shot.url && !shot.approved) {
      const ok = el("button", "fmini ok", "\u2713");
      ok.title = "Approve";
      ok.onclick = () => {
        shot.approved = true;
        ctx.save();
        ctx.rerender();
      };
      bar.append(ok);
    }
    frame.append(bar);
    strip.append(frame);
  });
  card.append(strip);
  const foot = el("div", "confirmrow");
  const anyShotGen = prod.shots.some((s) => s.status === "gen");
  const shootAll = el("button", "ghost", anyShotGen ? "Shooting\u2026" : "\u2728 Generate storyboard");
  shootAll.disabled = anyShotGen;
  shootAll.onclick = () => shootAll_(slot, ctx);
  foot.append(shootAll);
  const approvedShots = prod.shots.filter((s) => s.approved && s.url).length;
  const stitch = el("button", "primary", prod.status === "stitch" ? "Rendering video\u2026" : "\u{1F3AC} Render reel (video) \u2192");
  stitch.disabled = approvedShots < 1 || prod.status === "stitch";
  stitch.onclick = () => stitch_(slot, ctx);
  foot.append(stitch);
  card.append(foot);
  card.append(el("div", "note", `${approvedShots}/${prod.shots.length} beats approved \xB7 each renders into a real video clip (Seedance), then stitched.`));
  const rd = el("div", "refdrive");
  rd.append(el("span", "eyebrow", "Or \u2014 drive from a reference reel"));
  rd.append(el("p", "empty-note", "Paste a reference reel whose energy you like. Cast makes a NEW clip that follows its pacing on your locked persona \u2014 video \u2192 video, one shot, no shot-by-shot."));
  const rrow = el("div", "confirmrow");
  const inp = Object.assign(el("input"), { type: "text", placeholder: "https://\u2026/reference-reel.mp4", value: prod.refUrl || "" });
  inp.addEventListener("input", () => {
    prod.refUrl = inp.value;
    ctx.save();
  });
  const rbtn = el("button", "ghost", prod.refStatus === "gen" ? "Driving\u2026" : "\u{1F3AC} Generate from reference");
  rbtn.disabled = prod.refStatus === "gen" || prod.status === "stitch";
  const rerr = el("div", "note danger");
  rerr.hidden = true;
  rbtn.onclick = () => {
    const u = inp.value.trim();
    if (!u) {
      rerr.textContent = "Paste a reference reel URL to drive from.";
      rerr.hidden = false;
      return;
    }
    if (!a.assets.face?.url) {
      rerr.textContent = "Approve a face first \u2014 it's the identity we keep.";
      rerr.hidden = false;
      return;
    }
    rerr.hidden = true;
    driveFromRef(slot, ctx, u);
  };
  rrow.append(inp, rbtn);
  rd.append(rrow, rerr);
  card.append(rd);
  const shownShots = prod.shots.filter((s) => s.url);
  if (shownShots.length || prod.status === "stitch" || prod.error) renderReel(card, slot, ctx, prod, sc);
  return card;
}
function renderReel(card, slot, ctx, prod, sc) {
  const a = ctx.account, beats = sc.beats;
  const hasVideo = !!prod.stitchedUrl && /\.(mp4|webm|mov|m3u8)(\?|#|$)/i.test(prod.stitchedUrl);
  const out = el("div", "reelwrap");
  out.style.marginTop = "16px";
  const phone = el("div", "phone");
  out.append(phone);
  stopReel();
  if (prod.status === "stitch") {
    phone.append(el("div", "cyc"), Object.assign(el("div", "cap"), { textContent: prod.refStatus === "gen" ? "driving from reference\u2026" : "rendering video\u2026" }), el("div", "scan"));
  } else if (hasVideo) {
    phone.append(Object.assign(el("video"), { src: prod.stitchedUrl, autoplay: true, loop: true, muted: true, playsInline: true, controls: true }));
    phone.append(el("div", "live", "REEL"));
  } else {
    const cyc = el("div", "cyc");
    const cap = el("div", "cap");
    phone.append(cyc, cap, el("div", "live storyboard", "STORYBOARD"));
    let i = 0;
    const paint = () => {
      const shot = prod.shots[i % prod.shots.length];
      cyc.style.backgroundImage = shot?.url ? `url("${shot.url}")` : "";
      cap.textContent = beats[i % beats.length]?.line || "";
    };
    paint();
    reelTimer = setInterval(() => {
      i = (i + 1) % beats.length;
      paint();
    }, 2400);
  }
  const meta = el("div", "reelmeta");
  const vo = el("div", "vo");
  vo.append(el("b", null, hasVideo ? `Reel \xB7 ${personaName(a)}'s voice` : `The script \xB7 storyboard`));
  if (prod.error && prod.status !== "stitch") vo.append(el("div", "note danger", prod.error));
  if (!hasVideo && prod.status !== "stitch") vo.append(el("div", "empty-note", "This is the storyboard. Render each beat into real video with the button above."));
  const ol = el("ol", "beatlines");
  beats.forEach((b, i) => {
    const li = el("li");
    li.append(el("span", "bn", String(i + 1)), document.createTextNode(b.line || b.shot || ""));
    ol.append(li);
  });
  vo.append(ol);
  const row = el("div", "confirmrow");
  row.style.marginTop = "12px";
  const play = el("button", "ghost", "\u25B6 Play with voice");
  play.onclick = async () => {
    play.disabled = true;
    play.textContent = "Speaking\u2026";
    const v = await makeVoice(ctx, beats.map((b) => b.line).filter(Boolean).join("  "));
    v?.play();
    play.disabled = false;
    play.textContent = v ? `\u21BB Replay \xB7 ${v.backend}` : "voice unavailable";
  };
  row.append(play);
  if (hasVideo) {
    const ok = el("button", prod.approved ? "ghost" : "primary", prod.approved ? "Post approved \u2713 \u2014 published as context" : "Approve final cut \u2713");
    ok.onclick = () => {
      prod.approved = !prod.approved;
      if (prod.approved) slot.status = "produced";
      ctx.save();
      ctx.rerender();
    };
    row.append(ok);
  }
  vo.append(row);
  meta.append(vo);
  out.append(meta);
  card.append(out);
}
async function makeVoice(ctx, textLines) {
  if (!textLines) return null;
  if (!ctx.mock && ctx.relay?.stream) {
    try {
      const url = await generateSpeech(ctx.relay, textLines);
      if (url) return { backend: "Higgsfield TTS", play: () => {
        const au = new Audio(url);
        au.play().catch(() => {
        });
      } };
    } catch {
    }
  }
  if (!ctx.mock && ctx.relay?.speak && ctx.caps?.local?.tts) {
    try {
      const voice = ctx.caps.local.voices?.[0];
      const r = await ctx.relay.speak(textLines, voice ? { voice } : void 0);
      if (r?.audio) return { backend: r.backend || "local TTS", play: () => {
        const au = new Audio(r.audio);
        au.play().catch(() => {
        });
      } };
    } catch {
    }
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    return { backend: "browser speech", play: () => {
      const u = new SpeechSynthesisUtterance(textLines);
      u.rate = 1;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } };
  }
  return null;
}
async function genShot(slot, i, ctx) {
  const a = ctx.account, prod = a.productions[slot.id], shot = prod.shots[i];
  if (!ctx.mock && !ctx.relay) return;
  shot.status = "gen";
  ctx.rerender();
  try {
    let url;
    if (ctx.mock) {
      await wait(700);
      url = svgTile(shot.desc || `Shot ${i + 1}`, ...COLORS[i % COLORS.length], 288, 512);
    } else {
      const refs = [];
      if (a.assets.face?.url) refs.push({ handle: "face", filename: "face.png", url: a.assets.face.url });
      if (a.assets.setting?.url) refs.push({ handle: "loc", filename: "loc.png", url: a.assets.setting.url });
      const prompt = `${personaName(a)}. ${shot.desc}. ${a.foundation.locks.aesthetic?.title || ""} look. ${brandStyle(a)} vertical 9:16, photoreal, consistent face`.replace(/\s+/g, " ");
      url = refs.length ? await generateOnModel(ctx.relay, prompt, "9:16", refs, null, MODELS.shot) : await generateImage(ctx.relay, prompt, "9:16", MODELS.shot);
    }
    shot.url = url;
    shot.status = url ? "done" : "fail";
  } catch {
    shot.status = "fail";
  }
  ctx.save();
  ctx.rerender();
}
async function shootAll_(slot, ctx) {
  const prod = ctx.account.productions[slot.id];
  for (let i = 0; i < prod.shots.length; i++) if (!prod.shots[i].url && prod.shots[i].status !== "gen") await genShot(slot, i, ctx);
}
async function driveFromRef(slot, ctx, refUrl) {
  const a = ctx.account, prod = a.productions[slot.id];
  if (!ctx.mock && !ctx.relay) return;
  prod.error = null;
  prod.refStatus = "gen";
  prod.status = "stitch";
  prod.refUrl = refUrl;
  ctx.rerender();
  let out = null;
  try {
    const prompt = `${personaName(a)} \u2014 ${slot.title}. ${slot.angle || ""}`.trim();
    out = ctx.mock ? (await wait(1100), svgTile("Ref-driven reel", "#C8F250", "#6B4CF0", 288, 512)) : await refDrive(ctx.relay, a.assets.face.url, refUrl, prompt);
  } catch {
    out = null;
  }
  if (out) prod.stitchedUrl = out;
  else if (!ctx.mock) prod.error = "Reference drive failed \u2014 no video came back. Check the reel URL and try again.";
  prod.refStatus = "done";
  prod.status = prod.stitchedUrl ? "done" : "idle";
  ctx.save();
  ctx.rerender();
}
async function stitch_(slot, ctx) {
  const a = ctx.account, prod = a.productions[slot.id];
  if (!ctx.mock && !ctx.relay) return;
  prod.error = null;
  prod.status = "stitch";
  ctx.rerender();
  try {
    if (ctx.mock) {
      await wait(1e3);
      prod.stitchedUrl = prod.shots.find((s) => s.url)?.url || svgTile("Reel", "#FF5A3C", "#6B4CF0", 288, 512);
    } else {
      const face = a.assets?.face?.url;
      const clips = [];
      for (const s of prod.shots.filter((s2) => s2.approved && s2.url)) {
        let audio = null;
        try {
          if (s.line) audio = await generateSpeech(ctx.relay, s.line);
        } catch {
        }
        let clip = null;
        try {
          clip = await beatClip(ctx.relay, s.url, face || s.url, audio, s.desc);
        } catch {
        }
        if (!clip) {
          try {
            clip = await generateVideo(ctx.relay, s.url, s.desc || "natural, candid");
          } catch {
          }
        }
        if (clip) clips.push(clip);
      }
      const out = clips.length ? await stitchClips(ctx.relay, clips) : null;
      if (out) prod.stitchedUrl = out;
      else prod.error = "Rendering failed \u2014 no beat produced a clip. Try again.";
    }
  } catch {
    prod.error = "Rendering failed \u2014 try again.";
  }
  prod.status = prod.stitchedUrl ? "done" : "idle";
  ctx.save();
  ctx.rerender();
}
function field(label, value, ph, onInput) {
  const l = el("label", "field");
  l.append(el("span", null, label));
  const i = Object.assign(el("input"), { type: "text", value: value || "", placeholder: ph });
  i.addEventListener("input", () => onInput(i.value));
  l.append(i);
  return l;
}
function deriveNiche(idea) {
  const i = (idea || "").toLowerCase();
  return /\bai\b|artificial intel|prompt|chatgpt|claude/.test(i) ? "AI apps & how to use them" : /skin|serum|beauty/.test(i) ? "sustainable skincare" : /sneaker|street|hype/.test(i) ? "streetwear & sneakers" : /cook|food|recipe/.test(i) ? "home cooking" : /fit|gym|coach/.test(i) ? "fitness & mobility" : /home|interior|decor/.test(i) ? "home & interiors" : (idea || "lifestyle").split(/\s+/).slice(-2).join(" ");
}
function nextDate(a) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + 3 * ((a.calendar.slots || []).length + 1));
  return d.toISOString().slice(0, 10);
}
function monthShort(m) {
  const now = (/* @__PURE__ */ new Date()).getMonth() + 1;
  return ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][(parseInt(m, 10) || now) - 1] || "";
}
var ROUTER = { reference: renderReference, foundation: renderFoundation, assets: renderAssets, calendar: renderCalendar, scripts: renderScripts, produce: renderProduce };
function renderStage(stageId, root, ctx) {
  stopReel();
  stopCam();
  clear(root);
  (ROUTER[stageId] || renderReference)(root, ctx);
}
function mockFacet(facet, a) {
  const niche = a.reference.niche || "the niche";
  const pools = {
    persona: [
      { title: "Maya Chen", subtitle: "28, Lisbon \xB7 ex-lab chemist", body: "Reads every label; the trusted explainer of the niche.", chips: ["warm", "precise", "witty"], recommended: true },
      { title: "Rae Okafor", subtitle: "31, London \xB7 former esthetician", body: "The bold myth-buster with receipts.", chips: ["sharp", "funny", "contrarian"] },
      { title: "Noa Sato", subtitle: "26, Kyoto \xB7 slow-living writer", body: "The soft-life aesthete; calm routines, mood-first.", chips: ["gentle", "unhurried", "poetic"] }
    ],
    voice: [
      { title: "Warm & plain", body: "Talks like a friend who happens to know the science.", bullets: ["okay let's actually test this \u2014", "the step everyone skips:"], chips: ["kind", "clear", "dry-funny"], recommended: true },
      { title: "Dry & deadpan", body: "Deadpan, fast, allergic to hype.", bullets: ["no.", "here's why that's marketing:"], chips: ["deadpan", "quick", "skeptical"] },
      { title: "Soft & ASMR", body: "Low, unhurried, close-mic.", bullets: ["let's take a slow minute", "press, don't rub"], chips: ["soft", "calm", "intimate"] }
    ],
    aesthetic: [
      { title: "Sunlit film", body: "Warm 35mm grade, soft window light, shallow depth.", palette: [{ name: "cream", hex: "#F4E9D8" }, { name: "amber", hex: "#E8A85C" }, { name: "clay", hex: "#C6714B" }], chips: ["warm", "analog"], recommended: true },
      { title: "Cool clinical", body: "Crisp neutral white, even light, product-forward.", palette: [{ name: "paper", hex: "#F7F7F5" }, { name: "steel", hex: "#B9C2C7" }, { name: "ink", hex: "#2B2F33" }], chips: ["clean", "precise"] },
      { title: "Moody editorial", body: "Deep shadow, single hard light, matte finish.", palette: [{ name: "char", hex: "#22201E" }, { name: "rust", hex: "#8A4B32" }, { name: "bone", hex: "#D8CFC2" }], chips: ["dramatic", "matte"] }
    ],
    setting: [
      { title: "Sunlit Lisbon flat", body: "Tiled kitchen, big south window, plants everywhere.", bullets: ["marble counter", "sunny balcony", "bathroom shelf"], recommended: true },
      { title: "Concrete studio loft", body: "Grey micro-cement, north light, minimal props.", bullets: ["worktable", "window ledge", "bare wall"] },
      { title: "Cozy wood cabin", body: "Warm timber, low light, textiles.", bullets: ["reading nook", "kitchen table", "porch"] }
    ],
    audience: [
      { title: "The overwhelmed optimizer", subtitle: "F, 24-34, urban", body: "Comes for a routine they can actually keep.", chips: ["routines", "dupes"], recommended: true },
      { title: "The ingredient nerd", subtitle: "25-40, mixed", body: "Comes for the why behind the formula.", chips: ["breakdowns", "studies"] },
      { title: "The soft-life seeker", subtitle: "F, 20-30", body: "Comes for the calm as much as the tips.", chips: ["ASMR", "mood"] }
    ],
    pillars: [
      { title: "Myth vs. formulation", body: "Debunk a trend, show the simpler truth.", chips: ["dupe culture", "ingredient of the month"] },
      { title: "Calm routine", body: "A short on-location AM/PM routine.", chips: ["4-step AM", "wind-down PM"] },
      { title: "Label reads", body: "Read a real label on camera, plainly.", chips: ["decoding INCI", "spot the filler"] },
      { title: "Q&A from DMs", body: "Answer the most-asked question.", chips: ["SPF reapplication", "purging vs breakout"] },
      { title: "Behind the niche", body: "A person or brand doing it right.", chips: ["founder chat", "lab visit"] }
    ]
  };
  return (pools[facet.id] || []).map((c) => ({ ...c, id: newId() }));
}
function mockPlan(a) {
  const n = a.reference.niche || "your niche";
  const inDays2 = (days) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  return [
    { title: `The "skin cycling" backlash`, body: `React to the trend cooling; show your simpler routine.`, chips: ["Myth vs. formulation"], subtitle: "TikTok trends", date: inDays2(2) },
    { title: `Ingredient of the month: PDRN`, body: `Explain salmon-DNA serums plainly \u2014 hype?`, chips: ["Label reads"], subtitle: "Google News", date: inDays2(6) },
    { title: `A calm 4-step morning`, body: `On-location AM routine in the sunlit bathroom.`, chips: ["Calm routine"], subtitle: "Evergreen", date: inDays2(9) },
    { title: `SPF under makeup \u2014 the 3 asks`, body: `Answer the most-DM'd reapplication questions.`, chips: ["Q&A from DMs"], subtitle: "Audience DMs", date: inDays2(13) },
    { title: `\u20AC9 dupe vs. the \u20AC40`, body: `Break down why the formulation differs.`, chips: ["Myth vs. formulation"], subtitle: `Reddit`, date: inDays2(17) },
    { title: `A day in the lab`, body: `Behind-the-niche: how a small batch is made.`, chips: ["Behind the niche"], subtitle: "Original", date: inDays2(21) }
  ].map((c) => ({ ...c, id: newId() }));
}
function mockScript(a, slot) {
  const who = personaName(a);
  return [
    { shot: "Close-up, morning light, holding the bottle", line: `Okay, the ${slot.title.toLowerCase()} thing everyone's asking about \u2014 let's actually test it.` },
    { shot: "Over-the-shoulder at the bathroom shelf", line: `Two drops, press don't rub. That's the step people skip.` },
    { shot: "Mirror selfie, natural skin, mid-laugh", line: `A week in and my skin's just\u2026 calmer. No filter, promise.` },
    { shot: "Sitting on the counter, direct to camera", line: `If you try it, tag me \u2014 I read every one. ${who} out.` }
  ];
}

// src/cast/harness.js
var CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3C7vRtLEK6Ytdo6wiVn6PQba1if/";
var FACE = CDN + "hf_20260708_165159_040b3e48-62f1-4481-8e94-ee91ed743221.png";
var SETTING = CDN + "hf_20260708_173637_363a131c-daa2-4039-8fd6-80dd16714e45.png";
var SHOTS = {
  hook: CDN + "hf_20260708_174101_5e63667b-e4a2-473b-95f6-988d7a1475f0.png",
  // to camera
  chop: CDN + "hf_20260708_173653_ca278869-041c-4783-ad1c-5ea4b1c74251.png",
  // chopping herbs
  pour: CDN + "hf_20260708_174104_0f849645-1a83-4183-97ea-1338846cb690.png",
  // at the pan
  plate: CDN + "hf_20260708_174106_1c940c09-2a20-4fe8-842f-b5dccaca15da.png"
  // finished dish
};
var REEL = "https://d8j0ntlcm91z4.cloudfront.net/user_3C7vRtLEK6Ytdo6wiVn6PQba1if/hf_20260708_165300_9c0cfd3d-1e57-4d03-832e-5ef03f716a1f.mp4";
var REF_REEL = "https://d8j0ntlcm91z4.cloudfront.net/user_3C7vRtLEK6Ytdo6wiVn6PQba1if/hf_20260708_180511_8958cf14-c503-4e90-9a67-bd1b136b7cb4.mp4";
function resolve(prompt) {
  const p = (prompt || "").toLowerCase();
  if (/reference-driven|video_references|reference reel|follows the energy|motion_control/.test(p)) return REF_REEL;
  if (/generate_video|animate this keyframe|stitch|concatenat/.test(p)) return REEL;
  if (/no people|establishing shot|empty/.test(p)) return SETTING;
  if (/front-facing|portrait of nadia|identity reference/.test(p) && !/chop|pour|plated/.test(p)) return FACE;
  if (/chop|herbs/.test(p)) return SHOTS.chop;
  if (/pour|oil|pan|stove|sizzl/.test(p)) return SHOTS.pour;
  if (/plated|finished dish|holds up|holding up|proud|plate/.test(p)) return SHOTS.plate;
  if (/spoon|smil|gestur|hook|to camera/.test(p)) return SHOTS.hook;
  return SHOTS.hook;
}
var inDays = (days) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
function cannedArray(prompt) {
  const p = (prompt || "").toLowerCase();
  if (/pillar/.test(p)) return [{ title: "Genius kitchen tips", body: "A fast, surprising cooking hack per post.", chips: ["knife skills", "pantry swaps"] }, { title: "5-minute meals", body: "One quick recipe, start to plate.", chips: ["weeknight", "one-pan"] }, { title: "Myth vs. method", body: "Debunk a cooking myth on camera.", chips: ["salting pasta water", "resting meat"] }];
  if (/content plan|posts|calendar|trending/.test(p)) return [{ title: "3 genius cooking tips", body: "Rapid-fire kitchen hacks.", chips: ["Genius kitchen tips"], subtitle: "Trend", date: inDays(3) }, { title: "The pan-heat rule", body: "Why oil goes in AFTER the pan is hot.", chips: ["Myth vs. method"], subtitle: "Evergreen", date: inDays(7) }];
  if (/script|beats|shot.*line/.test(p)) return SEED_BEATS.map((b) => ({ title: b.shot, body: b.line }));
  return [{ title: "Nadia Rossi", subtitle: "home cooking & kitchen tips", body: "Warm, practical home cook who makes weeknight food feel easy.", chips: ["warm", "practical", "quick"], recommended: true }];
}
var BRAND = { id: "olio", name: "Olio", kind: "brand", data: { positioning: "small-batch cold-pressed olive oil for everyday cooking", category: "premium pantry / cooking", palette: ["#4C6B2F", "#C7A34A", "#F3ECD9"] } };
var SEED_BEATS = [
  { shot: "Smiling to camera in the kitchen, holding a wooden spoon", line: "Okay \u2014 three kitchen tips that genuinely changed how I cook." },
  { shot: "Close-up chopping fresh herbs on the board", line: "One: stack, roll, then chop. Twice as fast, no bruising." },
  { shot: "Pouring oil into a sizzling hot pan on the stove", line: "Two: heat the pan first, THEN a good glug of Olio. Nothing sticks." },
  { shot: "Holding up the finished plated dish, proud smile", line: "Three: finish with fresh herbs. Tag me if you try it!" }
];
function seedAccount() {
  const a = blankAccount();
  a.id = "cook";
  a.handle = "Nadia Rossi";
  a.stage = "produce";
  a.brand = BRAND;
  a.reference = { brief: "a warm, practical home cook sharing genius kitchen tips", niche: "home cooking & kitchen tips", inspirations: [{ handle: "@dailyoriginalvids", note: "fast-cut cooking hacks" }], moodNotes: "bright, sunlit, fast and friendly", locked: true };
  const lock = (title, extra = {}) => ({ id: newId(), title, ...extra });
  a.foundation.locks = {
    persona: lock("Nadia Rossi", { subtitle: "home cooking & kitchen tips", body: "Ex-restaurant line cook who makes weeknight food feel easy." }),
    voice: lock("Warm & practical", { body: "Talks like a friend walking you through it, no fuss.", chips: ["warm", "clear", "quick"] }),
    aesthetic: lock("Sunlit kitchen film", { body: "Warm natural light, wooden textures, shallow depth.", palette: [{ name: "cream", hex: "#F4E9D8" }, { name: "sage", hex: "#8FA97E" }, { name: "oak", hex: "#B07E4B" }] }),
    setting: lock("Bright home kitchen", { body: "Sunny counters, linen curtains, herbs on the sill." }),
    audience: lock("Busy home cooks", { subtitle: "25-45", body: "Wants dinner sorted without the fuss." }),
    pillars: lock("Genius kitchen tips", { body: "A fast, surprising cooking hack per post." })
  };
  a.foundation.more = { pillars: [lock("5-minute meals"), lock("Myth vs. method")] };
  a.assets.face = { url: FACE, status: "done", approved: true, name: "Nadia" };
  a.assets.setting = { url: SETTING, status: "done", approved: true, name: "Bright home kitchen" };
  a.calendar.slots = [{ id: "s1", date: inDays(3), pillar: "Genius kitchen tips", title: "3 genius cooking tips", angle: "Rapid-fire kitchen hacks, part one.", source: "Trend", approved: true, status: "planned" }];
  a.scripts = { s1: { beats: SEED_BEATS, approved: true, status: "written" } };
  a.productions = {};
  return a;
}
function harnessRelay() {
  const store = /* @__PURE__ */ new Map();
  const a = seedAccount();
  store.set(ACCOUNT_PREFIX + a.id, JSON.stringify(a));
  return {
    __harness: true,
    identity: async () => ({ name: "Sameep" }),
    capabilities: async () => ({ version: "0.1", methods: [], models: [], backends: ["higgsfield"], agentic: true, local: { tts: false } }),
    storage: {
      list: async () => [...store.keys()],
      get: async (k) => store.get(k) ?? null,
      set: async (k, v) => void store.set(k, v),
      delete: async (k) => void store.delete(k)
    },
    context: { active: async () => BRAND, publish: async (c) => c.id || newId(), list: async () => [BRAND], pick: async () => BRAND },
    speak: async () => null,
    // The heart of the harness: answer gen.js's agentic request with a real asset URL. A short delay
    // mimics render latency so the UI's loading states are visible, exactly as they'd be live.
    stream: async function* ({ prompt }) {
      await new Promise((r) => setTimeout(r, 900));
      const url = /json array/i.test(prompt || "") ? JSON.stringify(cannedArray(prompt)) : resolve(prompt);
      yield { type: "text", text: url };
    }
  };
}

// src/persona.js
var state = { relay: null, mock: false, caps: null, brand: null, accounts: [], current: null, loading: /* @__PURE__ */ new Set() };
var HARNESS = new URLSearchParams(location.search).has("harness");
var FRESH = new URLSearchParams(location.search).has("fresh");
mountConnect($("sbchip"), {
  scope: { reason: "Cast \u2014 build AI personas and produce on-model content, stage by stage", tools: ["mcp__claude_ai_Higgsfield__*", "WebSearch", "WebFetch"], contextKinds: ["brand", "persona"] },
  onConnect: (r) => {
    if (!HARNESS) boot(r, false);
  },
  onDisconnect: () => {
    if (HARNESS || state.mock || !state.relay) return;
    state.relay = null;
    setConnBanner(true);
  },
  onProjectChange: () => {
    if (!HARNESS) loadBrand();
  }
});
if (HARNESS) boot(harnessRelay(), false);
else whenRelayReady(1800).then((r) => {
  if (!("connect" in r) && !state.relay) boot(mockRelay(), true);
});
async function boot(relay, mock) {
  state.relay = relay;
  state.mock = mock;
  setConnBanner(false);
  state.caps = await (relay.capabilities ? relay.capabilities().catch(() => null) : null);
  $("hero").hidden = true;
  $("app").hidden = false;
  await loadBrand();
  state.accounts = await loadAccounts(relay);
  if (!state.accounts.length) {
    if (state.brand) autoStart();
    else newAccount();
  } else selectAccount(state.accounts[0].id);
}
function autoStart() {
  newAccount();
  const a = state.current, b = state.brand, d = b.data || {};
  const pos = d.positioning || d.tagline || "";
  a.reference = {
    brief: `an independent creator making content for ${b.name}${pos ? " \u2014 " + pos : ""}`,
    niche: d.niche || d.category || "",
    moodNotes: "",
    inspirations: [],
    locked: true
  };
  save();
  go("foundation");
  groundInBackground({ account: a, relay: state.relay, mock: state.mock, caps: state.caps, save: () => save(a), rerender: renderActiveStage });
}
async function loadBrand() {
  try {
    state.brand = state.relay ? await state.relay.context.active() : null;
  } catch {
    state.brand = null;
  }
  if (!state.brand && state.relay && !state.mock) {
    try {
      const metas = await state.relay.context.list();
      const m = (metas || []).find((x) => ["brand", "persona"].includes((x.kind || "").toLowerCase()));
      if (m) state.brand = await state.relay.context.use(m.id) || null;
    } catch {
    }
  }
  if (state.current && !state.current.brand && state.brand) state.current.brand = state.brand;
  renderBrandBar();
}
function setConnBanner(show) {
  const b = $("connbanner");
  if (b) b.hidden = !show;
}
function renderBrandBar() {
  const box = $("brandbar");
  if (!box) return;
  clear(box);
  const a = state.current;
  const b = a?.brand;
  box.append(el("span", "bk", "Brand context"));
  if (b) {
    const chip = el("span", "bchip");
    const pal = b.data?.palette;
    if (Array.isArray(pal) && pal.length) {
      const sw = el("span", "bsw");
      for (const c of pal.slice(0, 3)) {
        const i = el("i");
        i.style.background = c;
        sw.append(i);
      }
      chip.append(sw);
    }
    chip.append(document.createTextNode(b.name));
    box.append(chip);
    box.append(el("span", "empty-note", "\u2014 this persona creates for it"));
    const chg = el("button", "blink bspace", "Change");
    chg.onclick = pickBrand;
    box.append(chg);
    const rm = el("button", "blink dim", "Remove");
    rm.onclick = () => {
      a.brand = null;
      save();
      renderShell();
    };
    box.append(rm);
  } else {
    box.append(el("span", "empty-note", "None lent. The persona will be generic until you lend a brand."));
    const b2 = el("button", "blink bspace", "\uFF0B Lend a brand from Switchboard");
    b2.onclick = pickBrand;
    box.append(b2);
  }
}
async function pickBrand() {
  if (!state.relay) return;
  try {
    const c = await state.relay.context.pick();
    if (c && state.current) {
      state.current.brand = c;
      save();
      renderShell();
    }
  } catch {
  }
}
function newAccount() {
  flushSave();
  state.current = blankAccount();
  state.current.brand = state.brand || null;
  state.loading = /* @__PURE__ */ new Set();
  renderRail();
  renderShell();
}
function selectAccount(id) {
  const a = state.accounts.find((x) => x.id === id);
  if (!a) return;
  flushSave();
  state.current = JSON.parse(JSON.stringify(a));
  if (!state.current.brand && state.brand) state.current.brand = state.brand;
  state.current.stage = reachableStage(state.current);
  state.loading = /* @__PURE__ */ new Set();
  renderRail();
  renderShell();
}
async function duplicateAccount(id, ev) {
  ev?.stopPropagation();
  flushSave();
  const a = state.accounts.find((x) => x.id === id);
  if (!a) return;
  const copy = JSON.parse(JSON.stringify(a));
  copy.id = newId();
  copy.handle = personaName(a) + " copy";
  copy.updatedAt = Date.now();
  await persist(state.relay, copy);
  state.accounts = await loadAccounts(state.relay);
  selectAccount(copy.id);
}
function renderRail() {
  const box = $("plist");
  clear(box);
  const rows = [...state.accounts];
  if (state.current && !rows.find((a) => a.id === state.current.id)) rows.unshift(state.current);
  if (!rows.length) {
    box.append(el("div", "empty", "No accounts yet. Create your first \u2192"));
    return;
  }
  for (const a of rows) {
    const on = state.current && a.id === state.current.id;
    const row = el("div", "prow" + (on ? " on" : ""));
    const face = a.assets?.face?.url ? Object.assign(el("img", "face"), { src: a.assets.face.url }) : el("div", "face", (personaName(a) || "?")[0].toUpperCase());
    const txt = el("div");
    txt.style.minWidth = "0";
    txt.append(el("div", "nm", personaName(a)), el("div", "ni", stageLabel(a)));
    row.append(face, txt);
    const dup = el("button", "dup", "\u29C9");
    dup.title = "Duplicate";
    dup.onclick = (e) => duplicateAccount(a.id, e);
    row.append(dup);
    row.onclick = () => selectAccount(a.id);
    box.append(row);
  }
}
function stageLabel(a) {
  const reach = reachableStage(a);
  const done = STAGE_IDS.indexOf(reach);
  return `Stage ${done + 1} of 6 \xB7 ${reach}`;
}
function renderShell() {
  renderStepper($("stepper"), state.current, go);
  renderBrandBar();
  renderActiveStage();
}
function renderActiveStage() {
  const account = state.current;
  const ctx = {
    account,
    relay: state.relay,
    mock: state.mock,
    brand: state.brand,
    caps: state.caps,
    loading: state.loading,
    // save is bound to THIS ctx's account: a stage callback that resolves after an account switch
    // persists the account it actually mutated, never whatever state.current happens to be then.
    save: () => save(account),
    rerender: renderActiveStage,
    go
  };
  renderStage(state.current.stage, $("stage"), ctx);
  renderStepper($("stepper"), state.current, go);
}
function go(stageId) {
  state.current.stage = stageId;
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderShell();
}
var saveT = null;
var pendingAcct = null;
function save(acct) {
  const a = acct || state.current;
  if (!a) return;
  if (pendingAcct && pendingAcct !== a) flushSave();
  renderRail();
  clearTimeout(saveT);
  pendingAcct = a;
  saveT = setTimeout(() => {
    pendingAcct = null;
    void persistNow(a);
  }, 400);
}
async function persistNow(acct) {
  await persist(state.relay, acct);
  state.accounts = await loadAccounts(state.relay);
  if (state.current && !state.accounts.find((a) => a.id === state.current.id)) state.accounts.unshift(state.current);
  renderRail();
}
function flushSave() {
  if (!pendingAcct) return;
  clearTimeout(saveT);
  saveT = null;
  const acct = pendingAcct;
  pendingAcct = null;
  const i = state.accounts.findIndex((x) => x.id === acct.id);
  if (i >= 0) state.accounts[i] = acct;
  else state.accounts.unshift(acct);
  void persist(state.relay, acct);
}
$("newAccount").addEventListener("click", newAccount);
function mockRelay() {
  const store = /* @__PURE__ */ new Map();
  const brand = { id: "aamras", name: "Aamras", kind: "brand", data: { palette: ["#8B1A1A", "#F4A000"] } };
  if (!FRESH) {
    const seed = migrate({ id: "maya", name: "Maya Chen", niche: "sustainable skincare", vibe: "warm, plain-spoken, reads every label", story: "ex-lab chemist in Lisbon, small-batch serums", look: { referenceImage: svgTile("Maya", "#FF5A3C", "#FFB05A") }, wardrobe: [{ id: "w1", name: "Linen blazer", referenceImage: svgTile("Linen", "#E8DCC8", "#C9B89A") }], locations: [{ id: "l1", name: "Sunlit bathroom", referenceImage: svgTile("Bathroom", "#BFE3E0", "#7FBFB8") }], cast: [] });
    store.set(ACCOUNT_PREFIX + seed.id, JSON.stringify(seed));
  }
  return {
    __mock: true,
    identity: async () => ({ name: "Sameep" }),
    capabilities: async () => ({ version: "0.1", methods: [], models: [], backends: [], agentic: true, local: { tts: false } }),
    storage: { list: async () => [...store.keys()], get: async (k) => store.get(k) ?? null, set: async (k, v) => void store.set(k, v), delete: async (k) => void store.delete(k) },
    context: { active: async () => brand, publish: async (c) => (store.set("ctx:" + (c.id || newId()), JSON.stringify(c.data)), c.id), list: async () => [], pick: async () => brand },
    speak: async () => null,
    stream: async function* () {
      yield { type: "text", text: "" };
    }
  };
}
//# sourceMappingURL=persona.js.map
