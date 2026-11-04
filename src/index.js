import { DurableObject } from "cloudflare:workers";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode() {
  return Array.from(
    crypto.getRandomValues(new Uint8Array(6)),
    byte => alphabet[byte % alphabet.length]
  ).join("");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rooms" && request.method === "POST") {
      return Response.json({ code: makeCode() });
    }

    if (url.pathname === "/ws") {
      const code = (url.searchParams.get("room") || "").toUpperCase();
      const name = (url.searchParams.get("name") || "").trim().slice(0, 24);

      if (request.method !== "GET" ||
          request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
        return new Response("Expected a WebSocket connection", { status: 426 });
      }

      if (!/^[A-Z2-9]{6}$/.test(code) || !name) {
        return new Response("Invalid room code or name", { status: 400 });
      }

      const id = env.CHAT_ROOM.idFromName(code);
      return env.CHAT_ROOM.get(id).fetch(request);
    }

    return env.ASSETS.fetch(request);
  }
};

export class ChatRoom extends DurableObject {
  async fetch(request) {
    const name = (new URL(request.url).searchParams.get("name") || "")
      .trim()
      .slice(0, 24);

    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ name });

    const history = (await this.ctx.storage.get("messages")) || [];
    server.send(JSON.stringify({ type: "history", messages: history }));

    this.broadcast({ type: "system", text: name + " joined the room" });
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    if (typeof message !== "string" || message.length > 2000) return;

    try {
      const data = JSON.parse(message);
      const text = typeof data.text === "string"
        ? data.text.trim().slice(0, 500)
        : "";

      if (!text) return;

      const name = ws.deserializeAttachment()?.name || "Guest";
      const entry = { name, text, time: Date.now() };
      const history = (await this.ctx.storage.get("messages")) || [];

      history.push(entry);
      await this.ctx.storage.put("messages", history);
      this.broadcast({ type: "chat", ...entry });
    } catch {
      // Ignore malformed messages.
    }
  }

  async webSocketClose(ws) {
    const others = this.ctx.getWebSockets().filter(
      peer => peer !== ws && peer.readyState === WebSocket.OPEN
    );

    if (others.length === 0) {
      await this.ctx.storage.deleteAll();
      return;
    }

    const name = ws.deserializeAttachment()?.name || "Someone";
    this.broadcast({ type: "system", text: name + " left the room" });
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    for (const client of this.ctx.getWebSockets()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}
