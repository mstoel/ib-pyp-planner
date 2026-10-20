# IB PYP Planner

A personal, beginner-friendly planning workspace for learning and applying the International Baccalaureate Primary Years Programme (PYP), starting with Years 3–6.

> Independent planning aid. Not affiliated with or endorsed by the International Baccalaureate Organization.

## MVP features

- Guided unit-of-inquiry planner
- End-to-end planning journey: context, unit design, learning sequence, teaching notes, evidence collection and post-teaching reflection
- Online teaching and review form
- Combined print preview for browser printing or Save as PDF
- Guided mentor review with actionable checks for central idea, inquiry pathways, concepts/ATL, learning sequence, assessment, agency and reflection
- Six transdisciplinary theme options
- Central idea, lines of inquiry, key concepts, learner profile and ATL planning fields
- Prompts for prior knowledge, student questions, learning experiences, assessment, agency and reflection
- Beginner PYP learning guide
- Transparent planning-completeness checklist (not an official IB rating)
- Browser-local draft saving and plain-text export
- Responsive layout for desktop and mobile

## Run locally

Requires Node.js 20 or newer recommended.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

Build for production:

```bash
npm run build
npm run preview
```

## Current limitations

- Drafts are stored in the current browser using localStorage; they are not synced between devices.
- The first MVP does not yet call an AI API. The guide and checklist are starter features.
- Never add API keys or secrets to frontend code or commit them to Git.
- Export creates a plain-text planning pack including the unit and learning sequence. The print preview combines the unit, experiences, teaching record and reflection for browser printing or Save as PDF. The mentor review currently uses transparent, rule-based prompts from the information entered; it is not connected to a generative AI model yet. A polished designed PDF/DOCX export is a later milestone.

## Planned next milestones

1. Test and refine the unit-planning workflow.
2. Add structured lesson-sequence planning.
3. Add secure server-side AI mentor integration.
4. Add polished document export.
5. Add optional cloud persistence when useful.

## Planning principles

The planner should support inquiry, conceptual understanding, student agency, purposeful assessment, reflection and thoughtful alignment. It should explain suggestions and never claim an AI-generated unit is officially IB-approved. Use current official IB resources and school-specific guidance alongside this tool.

Official PYP overview: https://www.ibo.org/programmes/primary-years-programme/


## Deploy online (no custom domain required)

Cloudflare Pages is the preferred first hosting option for this private repository.

In Cloudflare:
1. Open **Workers & Pages** and choose **Create application** → **Pages** → **Connect to Git**.
2. Authorize GitHub if prompted, then select `mstoel/ib-pyp-planner`.
3. Use these build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy. Cloudflare will provide a `*.pages.dev` address; no purchased domain is required.
5. Future commits to `main` can trigger automatic redeployments.

Cloudflare account authorization must be completed by the account owner; it cannot safely be bypassed from this repository connection.

### Before sharing with other teachers

This first version is a prototype. It currently saves drafts in the browser on the device being used, and it does not yet have login, shared cloud storage, or live AI mentoring. Add those features before relying on it for important plans or student information.
