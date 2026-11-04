# Room Chat

## Run locally

1. Install Node.js.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npx wrangler login`.
5. Run `npm run dev` and open the local address Wrangler prints.

## Put it online

Run `npm run deploy`. Wrangler prints the public address for your chat site.

## Room and message cleanup

Messages are saved in the room's Durable Object storage. When the last browser connection closes, the project deletes that storage. If someone loses internet unexpectedly, the server may take a short time to notice the disconnect and clear the room.
