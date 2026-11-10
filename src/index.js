import { DurableObject } from "cloudflare:workers";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const allowedFrameOrigin = "https://orb.games";
const maxHistory = 100;
const maxRoomConnections = 100;
const messageCooldownMs = 750;

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

function secureResponse(response) {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", `frame-ancestors ${allowedFrameOrigin}`);
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

    if (url.pathname === "/ws") {
      if (!isSameOrigin(request)) return errorResponse("Origin not allowed", 403);
      const code = (url.searchParams.get("room") || "").toUpperCase();
      const name = (url.searchParams.get("name") || "").trim().slice(0, 24);
      if (request.method !== "GET" || request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
        return errorResponse("Expected a WebSocket connection", 426);
      }
      if (!/^[A-Z2-9]{4}$/.test(code) || !name) return errorResponse("Invalid room code or name", 400);
      const id = env.CHAT_ROOM.idFromName(code);
      return env.CHAT_ROOM.get(id).fetch(request);
    }

    return secureResponse(await env.ASSETS.fetch(request));
  }
};

export class ChatRoom extends DurableObject {
  async fetch(request) {
    const name = (new URL(request.url).searchParams.get("name") || "").trim().slice(0, 24);
    if (!name) return errorResponse("Invalid name", 400);
    if (this.ctx.getWebSockets().length >= maxRoomConnections) return errorResponse("Room is full", 429);

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

      const text = typeof data.text === "string" ? data.text.trim().slice(0, 500) : "";
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
        try {
          client.send(message);
        } catch {
          // A closing socket should not prevent delivery to the rest of the room.
        }
      }
    }
  }
}
