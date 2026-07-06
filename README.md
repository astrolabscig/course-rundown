# C++ Course Helper

A Next.js app that helps students pass their C++ course, taught as a full
curriculum (Parts 0–9: basics cheatsheet, functions, classes, encapsulation,
abstraction, inheritance, polymorphism, comparison-table reference cards, an
MCQ drill bank, and an output-prediction drill) built around real interactive
simulations rather than static prose — a stack/heap memory & pointer
visualizer, an access-control grid, an abstraction interface/implementation
toggle, a click-to-build inheritance hierarchy with construction/destruction
order animation, and a vtable/vptr dispatch simulator. Includes a feedback
form and a password-protected admin dashboard with usage analytics.

### Content status

`OOP_Rapid_Revision.pdf` — the authoritative source for exact CBT-wording
definitions, the golden sentences, the full comparison tables, all 40 MCQs,
and all 8 output-prediction snippets — has not yet been added to this
project. Everything that requires that exact wording currently ships with a
small, clearly-labelled starter/placeholder set (accurate C++, just not
verified against the PDF's specific phrasing). Add the PDF under
`/reference` and ask for the content-fidelity pass to swap in the verbatim
text, all 40 MCQs, and all 8 snippets.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- `@vercel/postgres` (Neon-backed) for storage
- `react-syntax-highlighter` for code blocks
- Node/Web Crypto for signed admin sessions (no auth library)

## Environment variables

Create a `.env.local` file (never commit this):

```bash
POSTGRES_URL=            # provided automatically by Vercel Postgres
ADMIN_PASSWORD=          # the admin login password
ADMIN_SESSION_SECRET=    # a long random string, e.g. `openssl rand -hex 32`
```

If `POSTGRES_URL` is unset, `/api/feedback` and `/api/track` log a warning
and return success so local/preview builds without a database still work.
The admin dashboard will show empty analytics in that case.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public app.

The admin dashboard is not linked from the UI. Visit
`http://localhost:3000/admin/login` and sign in with `ADMIN_PASSWORD`.

## Deploying on Vercel

1. Push this project to GitHub and import it into Vercel (it auto-detects
   Next.js).
2. In the Vercel project, add **Storage → Postgres** and connect it — this
   injects `POSTGRES_URL` automatically.
3. Add the `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` environment variables
   in Project Settings → Environment Variables.
4. Redeploy. Visit `/admin/login` on your deployed URL to see feedback and
   usage analytics. Keep the URL and password to yourself — it's the only
   way in.

## Routes

- `/` — the public learning app
- `/admin/login` — admin password form (not linked anywhere, `noindex`)
- `/admin` — protected analytics dashboard (`noindex`)
- `POST /api/feedback` — saves feedback
- `POST /api/track` — records an app open or interaction
- `POST /api/admin/login` — verifies password, sets the signed session cookie
- `POST /api/admin/logout` — clears the session cookie
