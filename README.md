# Workiffy Production Marketplace

This is the server-hostable Workiffy marketplace codebase.

It is not the earlier localStorage demo. Data is persisted in MongoDB, authenticated
users have role-specific access, and all marketplace state changes happen through
server-side APIs.

## Core functions included

### Service Seeker / Client
- account registration/login/logout
- client profile
- post fixed-price/hourly projects
- browse/manage own projects
- view incoming proposals
- shortlist/reject proposals
- send provider offers
- create fixed-price milestones
- search/save service providers
- contracts and workrooms
- workroom messages
- approve work/request revision
- complete contracts
- ratings/reviews
- notifications

### Service Provider
- account registration/login/logout
- professional profile, skills, availability and hourly rate
- find/search marketplace projects
- save projects
- submit one proposal per project
- withdraw proposals
- proposal status tracking
- receive/accept/decline contract offers
- active contract workroom
- milestone submission
- messaging
- ratings/reviews
- notifications

### Admin
- marketplace metrics
- user listing
- suspend/reactivate/close user accounts
- project listing

## Deliberately not faked

These need external commercial integrations and are intentionally not simulated
as real transactions:

- subscription card/UPI billing
- escrow/payment holding
- provider payout
- KYC/KYB
- tax invoices
- transactional email
- file/object storage
- malware scanning
- video calling

The code contains a subscription-access switch, but keep
`ENFORCE_SUBSCRIPTIONS=false` until a real billing provider and verified webhooks
are integrated.

## Architecture

```text
Browser
  |
  v
Workiffy HTML/CSS/JS SPA
  |
  v
Express 5 REST API
  |
  +-- HttpOnly JWT session
  +-- CSRF protection
  +-- role authorization
  +-- request validation
  +-- rate limiting / security headers
  |
  v
MongoDB / Mongoose
```

## Requirements

Use a supported Node.js LTS release. This package targets Node 24.

For production MongoDB, MongoDB Atlas is recommended. For local development you
can run MongoDB locally or use Docker.

## Local installation

```bash
npm install
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edit `.env`.

Local MongoDB example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/workiffy
```

Then:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

Expected database state:

```json
{
  "success": true,
  "database": "connected"
}
```

## MongoDB Atlas production configuration

1. Create an Atlas project/cluster.
2. Create a database user with only the permissions Workiffy requires.
3. Add the server's outbound public IP to Atlas Network Access, or use private
   networking where available.
4. Copy the Atlas application connection string into `MONGODB_URI`.
5. Ensure the connection string includes the `workiffy` database name.
6. URL-encode reserved characters in the database password.

Example:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/workiffy?retryWrites=true&w=majority
```

## Create the first admin

Set these in `.env`:

```env
ADMIN_NAME=Workiffy Admin
ADMIN_EMAIL=admin@workiffy.com
ADMIN_PASSWORD=use-a-long-random-admin-password
```

Then:

```bash
npm run create-admin
```

Remove or rotate the bootstrap admin password afterward.

## VPS deployment: PM2 + Nginx

Install production dependencies:

```bash
npm install --omit=dev
```

Test:

```bash
npm run check
NODE_ENV=production npm start
```

For PM2:

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

Copy `deploy/nginx/workiffy.conf` to your Nginx sites directory, update the
domain if needed, enable it, and add TLS using your normal certificate workflow.

Required production environment examples:

```env
NODE_ENV=production
PORT=3000
APP_ORIGIN=https://workiffy.com
TRUST_PROXY=1
MONGODB_URI=...
JWT_SECRET=...
COOKIE_DOMAIN=
ENFORCE_SUBSCRIPTIONS=false
```

## Docker deployment

Build and run the application container:

```bash
docker build -t workiffy .
docker run --env-file .env -p 3000:3000 workiffy
```

`docker-compose.yml` includes MongoDB for development/staging convenience.
For production, prefer a managed database rather than keeping the database in
the same application container stack unless your infrastructure team is
deliberately operating MongoDB.

## Security baseline

Included:
- bcrypt password hashing
- HttpOnly session cookie
- CSRF token checks on state-changing API requests
- role-based permissions
- active-account checks
- Zod validation
- MongoDB operator-key rejection
- Helmet headers / CSP
- request rate limiting
- API responses consistently returned as JSON
- secrets exclusively through environment variables
- graceful server shutdown
- MongoDB health endpoint

Before launch also add:
- email verification
- password-reset delivery
- MFA/passkeys option
- audit log retention
- centralized monitoring/alerting
- backup restore testing
- WAF/CDN rules
- real subscription billing
- payment/payout workflow
- KYC/KYB if required
- object storage and malware scanning for attachments
- privacy/terms/DPDP/GDPR implementation appropriate to served markets

## Project structure

```text
workiffy-production/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── server.js
├── scripts/
│   └── create-admin.mjs
├── deploy/nginx/workiffy.conf
├── Dockerfile
├── docker-compose.yml
├── ecosystem.config.cjs
├── package.json
└── .env.example
```
