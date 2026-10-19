# UKITECHSOLUTIONS — production-oriented website

Responsive multi-page technology learning website for cybersecurity, technology, computer science, programming, networking, projects, tutorials, and resources. This package now includes a Node.js/Express backend, PostgreSQL contact storage, protected admin dashboard, customer call/WhatsApp links, privacy-notice draft, and deployment instructions.

## Contact details
- Phone: +234 906 717 7330 (`tel:+2349067177330`)
- WhatsApp: +234 906 717 7330 (`https://wa.me/2349067177330`)
- Email: iliyasuukacha660@gmail.com

## Important status
**This is not yet a live website.** Hosting, domain, PostgreSQL, admin account, and SMTP delivery must be configured and tested by the site owner. Contact form submissions are stored only when the app is running and connected to PostgreSQL. Email notifications are sent only when valid SMTP settings are configured and the SMTP provider accepts the message. The newsletter signup has been removed as a demo rather than pretending to collect subscribers.

## Contents
- Existing public pages: `index.html`, `about.html`, `cybersecurity.html`, `technology.html`, `computer-science.html`, `programming.html`, `networking.html`, `projects.html`, `tutorials.html`, `resources.html`, `contact.html`
- `privacy.html` — privacy notice draft to review before launch
- `style.css`, `script.js`, `assets/favicon.svg` — shared front-end assets
- `server/index.js` — Express app, contact API, PostgreSQL setup, admin login/dashboard
- `server/create-admin.js` — securely prompt for admin username/password and store bcrypt hash
- `package.json` — server dependencies and commands
- `.env.example` — environment-variable template; copy to `.env` and never commit secrets
- `Dockerfile`, `render.yaml` — one hosting deployment path
- `DEPLOYMENT.md` — full setup and launch checklist

## Local run
Requirements: Node.js 20+ and a PostgreSQL database.

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` and a long random `SESSION_SECRET`; optionally set SMTP variables.
3. Run `npm install`.
4. Run `npm run check`.
5. Run `npm run create-admin` and follow the password prompts.
6. Run `npm start` and open `http://localhost:3000`.
7. Verify `/healthz`, send a contact message, and confirm it appears at `/admin`.

For public production hosting, use HTTPS, `NODE_ENV=production`, a TLS-enabled managed PostgreSQL database, and secret environment variables managed by the host. Read `DEPLOYMENT.md` before launch.

## Security notes
The backend uses Helmet security headers, rate limiting, Zod input validation, parameterized SQL, bcrypt password hashes, PostgreSQL-backed sessions, secure production cookies, CSRF checks for admin POST actions, HTML escaping, and a honeypot. Security depends on correct deployment, strong credentials, patched dependencies, database access controls, backups, and HTTPS. This is a practical starter implementation, not a substitute for an independent security review.
