# Ui_Path_AI_Mentor
The UiPath AI Mentor Chatbot is designed to help users resolve their queries related to UiPath. The system is connected to Lyzer for backend processing, allowing the chatbot to generate intelligent responses and provide guidance to users.

## Database support

This project uses PostgreSQL via [drizzle-orm](https://orm.drizzle.team) to store user accounts
and persist chat history. A `drizzle.config.ts` file is provided and migrations are generated
in the `migrations` folder.

To enable the database:

1. Provision a PostgreSQL database and set the `DATABASE_URL` environment variable. You can copy `.env.example` to `.env` and edit it to keep values in one place.
2. Run `npm run db:push` to apply the schema (it will create `users` and `chats` tables).
3. The server will automatically connect on startup when `DATABASE_URL` is set.

During development, an in‑memory store is used if no database URL is present.

### New API endpoints
- `POST /api/chat` — existing chat proxy, now also logs every exchange.
- `POST /api/users/register` — create a new user (password is stored in plaintext for
  demo purposes; hashing is recommended).
- `POST /api/users/login` — verify credentials.

## Running the app

Once you've set up the database (or opted to run in memory) you can start the
whole stack from the project root:

```bash
npm run dev
```

You can also initialize the database schema manually without running the
migration tool. A helper script is provided:

```bash
tsx script/init-db.ts      # requires DATABASE_URL
```

The development script sets `NODE_ENV=development` and, on Windows, also
launches **Chrome** pointing at `http://localhost:5000`.  Keep the terminal
open – when the server finishes building the browser tab will display the
client UI.

> 🛠️ The project includes TypeScript shims (`global.d.ts`) so it compiles
> without installing any `@types/*` dependencies. If you prefer proper
> type-checking, run `npm install --save-dev @types/node @types/express` etc.

If you're on macOS/Linux or prefer a different browser simply open the URL
yourself or adjust the `start <browser>` command in `package.json`.

## Deploying to Netlify

The repo is now oriented for a full-stack Netlify deployment. The client is
built with Vite into `dist/public`, and the Express API is bundled into a
single Netlify function (`netlify/functions/server.js`) using `esbuild` and
`serverless-http`.

1. Ensure the usual environment variables are provided (`DATABASE_URL`,
   `LYZER_API_KEY`, etc.). You can store them in the Netlify dashboard or a
   `.env` file when running locally with `netlify dev`.
2. Netlify will run `npm run build`, which:
   * builds the React client (`vite build`);
   * bundles server code for local use (`dist/index.cjs`);
   * bundles the Netlify function (`netlify/functions/server.js`).
3. The build command is defined in `netlify.toml`; static assets are published
   from `dist/public`.
4. During runtime Netlify sets `process.env.NETLIFY`, so the function skips
   attempting to serve static files (Netlify does that automatically).

To test locally with Netlify's CLI:

```bash
npm install -D netlify-cli                 # or globally
npm run netlify:dev                       # runs the dev server and functions
```

Your API will be available under `/.netlify/functions/server` and the
frontend served at `/`.

The project now includes a `netlify.toml` file with the necessary build
settings, and there's a `netlify:build`/`netlify:dev` script in
`package.json` for convenience.

