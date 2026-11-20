# CUT FREE backend

## Setup

1. From `my-website/backend`, run `npm install`.
2. Copy `.env.example` to `.env`. Set `MONGO_URI`, a random `JWT_SECRET` of at least 32 characters, and `CLIENT_ORIGIN` to the exact website origin. Keep `.env` private.
3. Allow only the server's outbound IP in MongoDB Atlas Network Access. Never use `0.0.0.0/0` in production.
4. Start MongoDB if using a local database.
5. Run `npm run dev` here, then run `npm run dev` from `my-website` in a second terminal.

Vite forwards `/api` to `http://localhost:5000`. The backend starts only after MongoDB connects. In production, serve the app over HTTPS. If deployed behind a reverse proxy, set `TRUST_PROXY_HOPS` to the exact number of trusted proxy hops so client IP rate limits work correctly. Do not set this unless the app is behind a trusted proxy.

## Authentication and access control

- `POST /api/auth/register` creates a pending Employee account. Public registration cannot assign elevated roles. Passwords need at least 12 characters (up to 72 UTF-8 bytes) and are hashed with bcrypt.
- `POST /api/auth/login` checks credentials and account status, then sets an eight-hour `HttpOnly`, `SameSite=Strict` cookie. It does not return the JWT to browser JavaScript.
- `POST /api/auth/logout` clears the session cookie; `GET /api/auth/me` returns the signed-in user.
- `GET /api/admin/pending-users` lists pending users for Owner/HR.
- `PATCH /api/admin/users/:id/status` activates/disables accounts for Owner/HR; HR can manage employee accounts only.
- `PATCH /api/admin/users/:id/role` lets only an Owner change roles.

To create the first Owner, first ensure the MongoDB IP allowlist permits this server. Set `BOOTSTRAP_OWNER_NAME`, `BOOTSTRAP_OWNER_ID`, `BOOTSTRAP_OWNER_EMAIL`, and a unique `BOOTSTRAP_OWNER_PASSWORD` of at least 16 characters in the backend environment, then run `npm run bootstrap-owner`. The command refuses if there is already an active Owner. Remove those four values after it succeeds. Do not expose bootstrap values in source control or command-line arguments.

Login and registration limits currently use in-memory counters. For a multi-instance production deployment, replace this with a shared rate-limit store so limits apply across all server instances.
