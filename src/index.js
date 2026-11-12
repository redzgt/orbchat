import { DurableObject } from "cloudflare:workers";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const maxHistory = 100;
const maxRoomConnections = 100;
const messageCooldownMs = 750;

// Match standalone words and common suffixes, including the requested partial
// slur form, without treating unrelated words such as "night" as a match.
const blockedTokenRules = [
  { exact: ["ass", "asses"] },
  { prefix: ["asshole", "bastard", "bitch", "bullshit", "cock", "cunt", "damn", "dick", "fag", "faggot", "fuck", "motherfuck", "piss", "prick", "pussy", "shit", "slut", "twat", "whore"] },
  { exact: ["nig"] },
  { prefix: ["nigg", "nigga"] }
];

function normalizeToken(token) {
  return token.normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[0]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[4@]/g, "a")
    .replace(/[5$]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/[8]/g, "b")
    .replace(/[^a-z]/g, "");
}

function containsBlockedLanguage(text) {
  const tokens = text.match(/[\p{L}\p{N}]+/gu) || [];
  return tokens.some(rawToken => {
    const token = normalizeToken(rawToken);
    return blockedTokenRules.some(rule =>
      rule.exact?.includes(token) || rule.prefix?.some(prefix => token.startsWith(prefix))
    );
  });
}

function isNameAllowed(name) {
  return !containsBlockedLanguage(name);
}

function censorMessage(text) {
  return text.replace(/[\p{L}\p{N}]+/gu, rawToken => {
    if (!containsBlockedLanguage(rawToken)) return rawToken;
    const letters = Array.from(rawToken);
    return letters[0] + "*".repeat(Math.max(0, letters.length - 1));
  });
}

function isSameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  try {
    const requestUrl = new URL(request.url);
    const originUrl = new URL(origin);
    return originUrl.protocol === requestUrl.protocol && originUrl.host === requestUrl.host;
  } catch {
    return false;
  }
}

function frameAncestorsForRequest(request) {
  const hostname = new URL(request.url).hostname;
  const labels = hostname.split(".");
  const domain = labels.length > 2 ? labels.slice(1).join(".") : hostname;
  return [`https://${domain}`, `https://*.${domain}`].join(" ");
}

function secureResponse(response, request) {
  const headers = new Headers(response.headers);
  const csp = headers.get("Content-Security-Policy") || "";
  const directives = csp.split(";").filter(directive => !/^\s*frame-ancestors(?:\s|$)/i.test(directive));
  directives.push(`frame-ancestors ${frameAncestorsForRequest(request)}`);
  headers.set("Content-Security-Policy", `${directives.join(";").replace(/^;+|;+$/g, "")};`);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function errorResponse(message, status) {
  return new Response(message, { status, headers: { "Cache-Control": "no-store" } });
}

function makeCode() {
  return Array.from(crypto.getRandomValues(new Uint8Array(4)), byte => alphabet[byte % alphabet.length]).join("");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rooms" && request.method === "POST") {
      if (!isSameOrigin(request)) return errorResponse("Origin not allowed", 403);
      return Response.json({ code: makeCode() }, { headers: { "Cache-Control": "no-store" } });
    }

    if (url.pathname === "/api/names/validate" && request.method === "POST") {
      if (!isSameOrigin(request)) return errorResponse("Origin not allowed", 403);
      let data;
      try { data = await request.json(); } catch { return errorResponse("Invalid request", 400); }
      const name = typeof data.name === "string" ? data.name.trim().slice(0, 24) : "";
      if (!name) return errorResponse("Enter a display name first.", 400);
      if (!isNameAllowed(name)) return errorResponse("This name is not allowed", 400);
      return Response.json({ allowed: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (url.pathname === "/api/rooms/check-name" && request.method === "POST") {
      if (!isSameOrigin(request)) return errorResponse("Origin not allowed", 403);
      let data;
      try { data = await request.json(); } catch { return errorResponse("Invalid request", 400); }
      const code = typeof data.code === "string" ? data.code.toUpperCase() : "";
      const name = typeof data.name === "string" ? data.name.trim().slice(0, 24) : "";
      if (!/^[A-Z2-9]{4}$/.test(code) || !name) return errorResponse("Invalid room code or name", 400);
      if (!isNameAllowed(name)) return errorResponse("This name is not allowed", 400);
      const id = env.CHAT_ROOM.idFromName(code);
      return env.CHAT_ROOM.get(id).fetch(new Request(`https://room.internal/check-name?name=${encodeURIComponent(name)}`));
    }

    if (url.pathname === "/ws") {
      if (!isSameOrigin(request)) return errorResponse("Origin not allowed", 403);
      const code = (url.searchParams.get("room") || "").toUpperCase();
      const name = (url.searchParams.get("name") || "").trim().slice(0, 24);
      if (request.method !== "GET" || request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
        return errorResponse("Expected a WebSocket connection", 426);
      }
      if (!/^[A-Z2-9]{4}$/.test(code) || !name) return errorResponse("Invalid room code or name", 400);
      if (!isNameAllowed(name)) return errorResponse("This name is not allowed", 400);
      const id = env.CHAT_ROOM.idFromName(code);
      return env.CHAT_ROOM.get(id).fetch(request);
    }

    return secureResponse(await env.ASSETS.fetch(request), request);
  }
};

export class ChatRoom extends DurableObject {
  async fetch(request) {
    const url = new URL(request.url);
    const name = (url.searchParams.get("name") || "").trim().slice(0, 24);

    if (url.pathname === "/check-name") {
      if (!name) return errorResponse("Invalid name", 400);
      if (!isNameAllowed(name)) return errorResponse("This name is not allowed", 400);
      const existing = this.ctx.getWebSockets().some(peer => {
        const peerName = peer.deserializeAttachment()?.name || "";
        return peer.readyState === WebSocket.OPEN && peerName.toLocaleLowerCase() === name.toLocaleLowerCase();
      });
      if (existing) return errorResponse("Someone has your name, please change your name", 409);
      return Response.json({ available: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (!name) return errorResponse("Invalid name", 400);
    if (!isNameAllowed(name)) return errorResponse("This name is not allowed", 400);
    if (this.ctx.getWebSockets().length >= maxRoomConnections) return errorResponse("Room is full", 429);
    const duplicate = this.ctx.getWebSockets().some(peer => {
      const peerName = peer.deserializeAttachment()?.name || "";
      return peer.readyState === WebSocket.OPEN && peerName.toLocaleLowerCase() === name.toLocaleLowerCase();
    });
    if (duplicate) return errorResponse("Someone has your name, please change your name", 409);

    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ name, lastMessageAt: 0 });
    const history = (await this.ctx.storage.get("messages")) || [];
    server.send(JSON.stringify({ type: "history", messages: Array.isArray(history) ? history.slice(-maxHistory) : [] }));
    this.broadcast({ type: "system", text: name + " joined the room" });
    this.broadcastPresence();
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    if (typeof message !== "string" || message.length > 2000) return;
    try {
      const data = JSON.parse(message);
      const attachment = ws.deserializeAttachment() || {};
      if (data.type === "typing") {
        this.broadcast({ type: "typing", name: attachment.name || "Guest", isTyping: data.isTyping === true });
        return;
      }

      const text = typeof data.text === "string" ? censorMessage(data.text.trim()).slice(0, 500) : "";
      if (!text) return;
      const now = Date.now();
      if (now - (attachment.lastMessageAt || 0) < messageCooldownMs) return;
      ws.serializeAttachment({ name: attachment.name || "Guest", lastMessageAt: now });
      const entry = { name: attachment.name || "Guest", text, time: now };
      const storedHistory = await this.ctx.storage.get("messages");
      const history = Array.isArray(storedHistory) ? storedHistory : [];
      history.push(entry);
      if (history.length > maxHistory) history.splice(0, history.length - maxHistory);
      await this.ctx.storage.put("messages", history);
      this.broadcast({ type: "chat", ...entry });
    } catch {
      // Ignore malformed messages.
    }
  }

  async webSocketClose(ws) {
    const others = this.ctx.getWebSockets().filter(peer => peer !== ws && peer.readyState === WebSocket.OPEN);
    if (others.length === 0) {
      await this.ctx.storage.deleteAll();
      return;
    }
    const name = ws.deserializeAttachment()?.name || "Someone";
    this.broadcast({ type: "system", text: name + " left the room" });
    this.broadcastPresence();
    this.broadcast({ type: "typing", name, isTyping: false });
  }

  broadcastPresence() {
    const count = this.ctx.getWebSockets().filter(client => client.readyState === WebSocket.OPEN).length;
    this.broadcast({ type: "presence", count });
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    for (const client of this.ctx.getWebSockets()) {
      if (client.readyState === WebSocket.OPEN) {
        try { client.send(message); } catch { /* Ignore a socket while it closes. */ }
      }
    }
  }
}
