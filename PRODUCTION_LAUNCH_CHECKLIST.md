# Workiffy Production Launch Checklist

## 1. Server
- Node.js 24 LTS installed.
- Nginx installed and reverse proxy configured.
- PM2 or another process supervisor configured.
- Server firewall permits only required ports.
- HTTPS certificate enabled before public launch.
- Canonical production origin matches `APP_ORIGIN`.

## 2. MongoDB Atlas
- Production cluster created.
- Dedicated Workiffy database user created.
- Least-privilege permissions configured.
- Application server IP/private network allowed.
- `MONGODB_URI` contains `/workiffy`.
- Reserved characters in username/password are URL-encoded.
- Backups configured.
- Restore procedure tested.

## 3. Environment
Set production secrets outside Git:

```env
NODE_ENV=production
PORT=3000
APP_ORIGIN=https://workiffy.com
TRUST_PROXY=1
MONGODB_URI=...
JWT_SECRET=...
COOKIE_DOMAIN=
ENFORCE_SUBSCRIPTIONS=false
SUPPORT_EMAIL=support@workiffy.com
```

Generate a strong unique `JWT_SECRET`.

## 4. Admin
Create the first admin:

```bash
npm run create-admin
```

Then remove/rotate the bootstrap password from the deployment environment.

## 5. Marketplace test
Create two separate accounts and test end-to-end:

1. Client registers.
2. Client completes profile.
3. Client posts project.
4. Provider registers.
5. Provider completes profile.
6. Provider finds the project.
7. Provider submits proposal.
8. Client sees proposal.
9. Client shortlists/rejects as appropriate.
10. Client sends offer.
11. Provider receives offer.
12. Provider accepts.
13. Both users open workroom.
14. Messages persist.
15. Provider submits milestone.
16. Client requests revision or approves.
17. All milestones approved.
18. Client completes contract.
19. Both users can review.
20. Notifications appear throughout the workflow.

## 6. Subscription enforcement
The code supports:
- Client plan: `client`
- Provider plan: `provider`
- Cross-role premium plan: `business`

Admin can manually update user subscriptions.

Keep:

```env
ENFORCE_SUBSCRIPTIONS=false
```

until you deliberately want paid-plan restrictions.

When set to `true`:
- clients require an active `client` or `business` plan for protected marketplace actions;
- providers require an active `provider` or `business` plan for protected marketplace actions;
- provider access to client identity is redacted without active subscription.

## 7. External integrations still required for a commercial launch
These cannot be safely invented without Workiffy's actual provider accounts and commercial policies:

- payment gateway
- recurring subscription billing
- marketplace payout
- escrow/payment protection
- KYC/KYB
- tax/GST invoice workflow
- transactional email provider
- password-reset email delivery
- email verification
- object storage for attachments
- malware/file scanning
- real-time WebSocket/SSE messaging
- monitoring/alerting service

## 8. Security before public launch
- Force HTTPS.
- Keep `.env` outside source control.
- Run `npm audit` after dependency installation.
- Review dependency advisories before every release.
- Put production secrets in a server secret manager where possible.
- Add centralized logs and alerting.
- Test backup restore.
- Add MFA/passkeys for admin accounts.
- Add a distributed rate-limit store before horizontal scaling.
- Complete privacy policy, terms, marketplace rules and applicable data-protection compliance.
