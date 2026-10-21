# Supabase setup for the PYP Planner

This app is hosted on GitHub Pages. Supabase provides authentication and cloud storage; the AI mentor runs as a Supabase Edge Function so the Gemini API key never reaches the browser.

## Important separation

Create a **new Supabase project dedicated to the PYP Planner**. Do not run this schema in the existing Assessly/A2Grammar project.

## 1. Create the Supabase project

In the Supabase dashboard, create a project named something like `pyp-planner`. Save the database password somewhere secure.

## 2. Create the database tables

In the new project's **SQL Editor**, open a new query, paste the complete contents of `supabase/schema.sql`, and run it. This creates profiles, workspaces, memberships, and unit drafts with row-level security policies.

Draft access is restricted by Supabase policies. A user can read and manage their own drafts. Drafts can also be shared in a workspace when a membership is added. Do not disable row-level security.

## 3. Configure authentication

In **Authentication → URL Configuration**, set the Site URL to:

`https://mstoel.github.io/ib-pyp-planner/`

Add this redirect URL:

`https://mstoel.github.io/ib-pyp-planner/**`

Use email/password sign-in initially. For a private pilot, disable public sign-ups after creating the intended teacher accounts, or keep sign-up enabled only while testing.

## 4. Frontend configuration

The browser only needs the project URL and the publishable (or legacy anon) key. These are designed for browser use when row-level security is correctly enabled; never use a service-role key in the frontend.

The GitHub Pages build will need these GitHub Actions repository secrets:

- `VITE_SUPABASE_URL` — the new project's Project URL
- `VITE_SUPABASE_ANON_KEY` — the project's publishable key (or legacy anon key)

Add them under **GitHub repository → Settings → Secrets and variables → Actions**. The app must be rebuilt after adding them.

## 5. AI mentor function

Deploy `supabase/functions/ai-mentor/index.ts` as an Edge Function named `ai-mentor`. Set these function secrets in the new Supabase project:

- `GEMINI_API_KEY` — your Google AI Studio Gemini API key; enter it directly in Supabase secrets, not in GitHub files or frontend code
- `GEMINI_MODEL` — optional; defaults to `gemini-2.5-flash`

Supabase provides `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Edge Functions. The function requires a valid signed-in user session before calling Gemini. If Gemini returns a rate-limit error, wait before retrying; the free tier has usage limits.

## 6. Important current status

These files prepare the backend schema and AI endpoint. The React app still needs its sign-in screen, cloud draft list/save/delete integration, and AI mentor controls wired to these services. Until that frontend integration is deployed and tested, existing browser-local drafts remain local and the AI mentor is not yet active. The Edge Function source is configured for Gemini, but it must be deployed in Supabase before it can run.

## 7. Pilot checklist before inviting other teachers

- Test sign-up/sign-in and sign-out.
- Confirm one teacher cannot read another teacher's private drafts.
- Confirm a saved draft survives refresh and a different device.
- Confirm separate teachers can plan separate units without overwriting each other.
- Confirm draft deletion is deliberate and restricted to authorised users.
- Test AI feedback with a sample plan and review its suggestions before applying them.
