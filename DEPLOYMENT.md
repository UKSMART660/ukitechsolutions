# UKITECHSOLUTIONS: production deployment guide

This package is **deployment-ready code**, not a live hosted service. No domain, cloud database, SMTP account, or hosting account has been configured or tested from this package. The website is not public until you complete these steps and verify the live checks.

## 1. What you need
- GitHub account (to store the source code privately or publicly; never commit `.env`).
- A hosting service that supports the included Dockerfile (the included `render.yaml` targets Render).
- Managed PostgreSQL database with TLS, such as a hosted PostgreSQL provider.
- Optional SMTP provider account for email notifications. Verify the sender address/domain with the provider.
- A domain name if you want a custom domain. Hosting provider subdomains can be used initially.

## 2. Create the PostgreSQL database
1. Create a PostgreSQL database in your provider dashboard.
2. Copy the provider's connection URL. It should include TLS/SSL requirements where the provider instructs.
3. Use a dedicated database user with only the privileges required for this application. Do not expose the database publicly if the provider supports network restrictions.
4. Back up the database and set a retention policy.

The application creates `contact_messages`, `admin_users`, and `user_sessions` tables on startup. The database must be reachable from the app.

## 3. Configure environment variables
Copy `.env.example` to `.env` for local development and fill the values. For production, set them in the host's secret/environment-variable dashboard, not in source code.

- `DATABASE_URL`: TLS-enabled PostgreSQL connection URL.
- `SESSION_SECRET`: use a long unique random value, e.g. generate with `openssl rand -base64 48`.
- `NODE_ENV=production`, `TRUST_PROXY=1` on a trusted reverse-proxy host.
- `CONTACT_EMAIL=iliyasuukacha660@gmail.com`.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`: optional; all must be valid for notifications to send. Configure the SMTP provider and verify its sender first.
- `PUBLIC_BASE_URL`: your final HTTPS URL.

Never paste passwords or SMTP secrets into source files, chat messages, or Git. If a secret leaks, rotate it immediately.

## 4. Create the administrator account
On a machine/environment that can reach the configured database:

```bash
npm install
npm run create-admin
```

Enter a username and a strong password of at least 14 characters when prompted. The password is hashed with bcrypt before it is stored. Run this command again to reset the password for the same username. Do not share admin credentials. After setup, open `https://YOUR-DOMAIN/admin/login`.

## 5. Deploy to Render (one option)
1. Push this project folder to a Git repository. Ensure `.env` and `node_modules` are not committed.
2. Create the PostgreSQL database separately and keep its connection URL ready.
3. In Render, create a new Blueprint from the repository and review `render.yaml`. Or create a Docker web service using the included `Dockerfile`.
4. Set `DATABASE_URL`, `SESSION_SECRET`, `PUBLIC_BASE_URL`, and any SMTP secrets in the service environment. Do not rely on placeholder values.
5. Deploy and wait for a successful build/startup. The process will fail to start if production-required database/session settings are absent or the database cannot be reached.
6. After deployment, run `npm run create-admin` from a secure shell/environment that has the production `DATABASE_URL`. If the host does not offer a shell, run the script locally with the production DB URL in a secure local `.env`, then remove that file when finished.
7. Open `/healthz`; it should return `{"ok":true,"database":"connected"}`. This confirms the app can query the database, not that SMTP works.
8. Submit a test contact form and confirm the success message and that the record appears at `/admin`. Test login, status update, deletion on a disposable test message, phone link, and WhatsApp link.
9. If using a custom domain, connect it through the host and wait for HTTPS/TLS to be active before testing the admin or contact form.

Hosting provider pricing and UI can change; review current provider instructions and costs before creating resources.

## 6. Configure and test email notifications
Email is deliberately optional. Set all SMTP variables only after you have a working SMTP account and verified sender. Deploy, submit a test enquiry, and check server logs and the inbox/spam folder. The contact form response explicitly distinguishes a database save from an email notification. A message can be safely stored even when email notification fails.

## 7. Local test
Requirements: Node.js 20+ and PostgreSQL.

```bash
npm install
cp .env.example .env
# Edit .env with a local PostgreSQL URL and a long SESSION_SECRET
npm run check
npm run create-admin
npm start
```

Open `http://localhost:3000`. For local development, `NODE_ENV` may be `development` so the session cookie does not require HTTPS. Do not use development mode for a public deployment.

## 8. Pre-launch checklist
- [ ] HTTPS enabled; `NODE_ENV=production` and strong session secret set.
- [ ] PostgreSQL reachable and backups/retention configured.
- [ ] Admin account created; strong unique password stored securely.
- [ ] `/healthz` reports database connected.
- [ ] Test contact message appears in the admin dashboard.
- [ ] SMTP test passed, or clearly accept that email notifications are not configured.
- [ ] Phone `tel:+2349067177330` and WhatsApp `https://wa.me/2349067177330` tested on a phone.
- [ ] Privacy notice reviewed and published; restrict access to customer contact records.
- [ ] Official social media URLs, domain, analytics/cookie choices, and any other placeholders reviewed.
- [ ] Dependency updates and database restore procedure documented.

## Privacy and retention
The form collects name, email, topic, message, and a one-way hash of the connecting IP for abuse prevention. Messages are retained until an administrator deletes them or a retention policy is implemented. Publish a privacy notice that accurately identifies the data controller, purpose, retention, contact method, and any applicable legal requirements before launch. Do not collect sensitive data through this form.
