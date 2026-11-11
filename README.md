# OrbChat

A compact, temporary room experience designed to embed cleanly inside Orb Games while remaining usable as a standalone page.

## Security and capacity

- The page may be embedded by HTTPS hosts on the same parent domain as the Worker (for example, `rooms.example.com` allows `example.com` and `math.example.com`).
- Room creation and WebSocket upgrades require a same-origin browser request.
- Rooms allow up to 100 simultaneous connections.
- Each connection may send at most one accepted message every 750 ms.
- Only the newest 100 messages are retained while a room is active.
- Room storage is deleted after the final connection closes.

## Run locally

1. Install Node.js.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npx wrangler login`.
5. Run `npm run dev` and open the local address Wrangler prints.

## Put it online

Run `npm run deploy`. Wrangler prints the public address for the site.

## Room and message cleanup

Messages are saved in the room's Durable Object storage. When the last browser connection closes, the project deletes that storage. If someone loses internet unexpectedly, the server may take a short time to notice the disconnect and clear the room.
