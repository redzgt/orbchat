(() => {
  const mutedNames = new Set(JSON.parse(localStorage.getItem("orbchat-muted-names") || "[]"));
  const participantKey = "orbchat-participant-id";
  let participantId = localStorage.getItem(participantKey);
  if (!participantId) {
    participantId = crypto.randomUUID();
    localStorage.setItem(participantKey, participantId);
  }

  const NativeWebSocket = window.WebSocket;
  window.WebSocket = class extends NativeWebSocket {
    constructor(url, protocols) {
      const socketUrl = new URL(url, location.href);
      socketUrl.searchParams.set("participant", participantId);
      super(socketUrl, protocols);
    }
  };
  window.WebSocket.CONNECTING = NativeWebSocket.CONNECTING;
  window.WebSocket.OPEN = NativeWebSocket.OPEN;
  window.WebSocket.CLOSING = NativeWebSocket.CLOSING;
  window.WebSocket.CLOSED = NativeWebSocket.CLOSED;

  async function connectWithValidation(code) {
    const name = (document.getElementById("name")?.value || document.getElementById("savedName")?.textContent || "").trim();
    const status = document.getElementById("status");
    if (!name) {
      if (status) status.textContent = "Enter and save a display name first.";
      document.getElementById("name")?.focus();
      return;
    }
    try {
      const response = await fetch("/api/rooms/check-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, participantId })
      });
      if (!response.ok) {
        if (status) status.textContent = await response.text();
        return;
      }
      window.orbchatConnectInternal(code);
    } catch {
      if (status) status.textContent = "Could not check the room. Try again.";
    }
  }

  // The worker renames the original connect function so every join can first
  // perform the server-side duplicate-name check. Route all existing UI
  // handlers (manual code, create random ID, and public rooms) through it.
  window.orbchatConnect = connectWithValidation;
  window.connect = connectWithValidation;

  function addPublicRooms() {
    const lobby = document.getElementById("lobby");
    const createRow = lobby?.querySelector(".create-row");
    if (!lobby || !createRow || document.getElementById("publicRooms")) return;
    const section = document.createElement("section");
    section.id = "publicRooms";
    section.setAttribute("aria-labelledby", "publicRoomsHeading");
    section.style.marginTop = "22px";
    const heading = document.createElement("h2");
    heading.id = "publicRoomsHeading";
    heading.textContent = "Public rooms";
    heading.style.cssText = "margin:0 0 8px;color:#aebce8;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Public 1";
    button.setAttribute("aria-label", "Join Public 1");
    button.style.cssText = "width:100%;min-height:44px;padding:0 12px;text-align:left;background:transparent;color:#f7f8ff;border:1px solid #24356f;border-radius:8px";
    button.addEventListener("click", () => connectWithValidation("OPEN"));
    section.append(heading, button);
    createRow.insertAdjacentElement("afterend", section);
  }

  function saveMutedNames() {
    localStorage.setItem("orbchat-muted-names", JSON.stringify([...mutedNames]));
  }

  function muteToggle(button, name) {
    const key = name.toLocaleLowerCase();
    const isMuted = mutedNames.has(key);
    if (isMuted) mutedNames.delete(key);
    else mutedNames.add(key);
    saveMutedNames();
    button.setAttribute("aria-pressed", String(!isMuted));
    button.dataset.muted = String(!isMuted);
    button.title = isMuted ? "Mute" : "Unmute";
    button.setAttribute("aria-label", `${isMuted ? "Mute" : "Unmute"} ${name}`);
    applyMuteFilter();
  }

  function decorateNames() {
    document.querySelectorAll("#messages .message:not(.system)").forEach(message => {
      const nameEl = message.querySelector("strong");
      if (!nameEl || nameEl.dataset.muteReady) return;
      const name = nameEl.textContent || "";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mute-name";
      button.textContent = name;
      button.dataset.muteReady = "true";
      button.setAttribute("aria-pressed", String(mutedNames.has(name.toLocaleLowerCase())));
      button.setAttribute("aria-label", `${mutedNames.has(name.toLocaleLowerCase()) ? "Unmute" : "Mute"} ${name}`);
      button.title = mutedNames.has(name.toLocaleLowerCase()) ? "Unmute" : "Mute";
      button.addEventListener("click", () => muteToggle(button, name));
      nameEl.replaceWith(button);
    });
    applyMuteFilter();
  }

  function applyMuteFilter() {
    document.querySelectorAll("#messages .message:not(.system)").forEach(message => {
      const author = message.querySelector(".mute-name")?.textContent || message.querySelector("strong")?.textContent || "";
      const shouldHide = mutedNames.has(author.toLocaleLowerCase());
      message.hidden = shouldHide;
      if (shouldHide) message.setAttribute("aria-hidden", "true");
      else message.removeAttribute("aria-hidden");
    });
  }

  function installMuteStyles() {
    if (document.getElementById("muteStyles")) return;
    const style = document.createElement("style");
    style.id = "muteStyles";
    style.textContent = `
      #messages .mute-name {
        position:relative;display:inline-flex;align-items:center;margin:0 6px 2px 0;padding:0;
        min-height:0;border:0;border-radius:0;background:transparent;color:inherit;
        font:inherit;font-size:12px;font-weight:800;line-height:inherit;cursor:pointer;
      }
      #messages .mute-name:hover { background:transparent;color:#ff7185; }
      #messages .mute-name::after {
        content:"Mute";position:absolute;left:50%;bottom:calc(100% + 4px);transform:translate(-50%,3px);
        padding:2px 6px;border-radius:4px;background:#ff526b;color:#fff;font-size:9px;font-weight:800;
        line-height:1.2;opacity:0;pointer-events:none;white-space:nowrap;transition:opacity 120ms ease,transform 120ms ease;
      }
      #messages .mute-name:hover::after,#messages .mute-name:focus-visible::after { opacity:1;transform:translate(-50%,0); }
      #messages .message.self .mute-name { padding:3px 9px;border-radius:999px;background:var(--blue-bright);color:var(--ink); }
      #messages .message.self .mute-name:hover { color:var(--ink); }
      #messages .message.self .mute-name::after { color:#fff; }
    `;
    document.head.append(style);
  }

  function initialize() {
    addPublicRooms();
    installMuteStyles();
    const messages = document.getElementById("messages");
    if (messages) new MutationObserver(decorateNames).observe(messages, { childList: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
