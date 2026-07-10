# CLAUDE.md — Edge Spectrum (hub)

> Repo-specific guidance. Ecosystem-wide rules live in the central workspace file at
> `Agents/Claude/CLAUDE.md` (under `Mikes_AI_Lab/`). This file overrides it where they differ.

## What this is

**Edge Spectrum** — `edge-spectrum.mikesailab.com` 🟢 Live — a **multi-tool hub** for sports,
betting, investing, odds, and gambling analysis. Started (2026-07-10) by merging the standalone
**Sports-Betting-Backtester** app into the original **Betting_Spectrum** repo; built so each new
tool is roughly *one registry entry + one page*.

> **History:** the GitHub repo was renamed `Betting_Spectrum` → `edge-spectrum`. The old
> Sports-Betting-Backtester repo is archived. Restore point before the merge: git tag
> `backup/pre-hub-merge`.

## Stack & hosting

- **Vite + React 19 + TS**, Tailwind v4 (`@tailwindcss/vite`), Recharts + D3, `@google/genai` (Gemini).
- **Host: Vercel** (project `edge-spectrum`). Working branch **`mike_desktop`**, deploy branch **`main`**.
  Deploy via CLI: `vercel deploy --prod` from the repo root. (Git-connected; production branch may also
  be set to `main` in the dashboard for push-to-deploy.)
- `server.ts` (Express + Vite middleware) is **local dev only**; on Vercel the SPA is served from `dist/`
  and `api/*` run as serverless functions. `vercel.json` has an SPA rewrite so client routes deep-link.

## Layout

```
src/
  tools.ts          # THE REGISTRY — single source of truth for every tool
  App.tsx           # BrowserRouter shell + slim HubNav; routes derived from the tools
  pages/Home.tsx    # hub landing = tile grid, maps over tools.ts
  BacktesterApp.tsx # the Backtest Simulator (mounted at /backtester)
  components/        # Backtester UI (Header, StrategyBuilder, ResultsDashboard, …)
  server/            # backtest / espn / advisor logic — imported by BOTH server.ts and api/
  dataGenerator.ts, types.ts
api/                # Vercel serverless: backtest.ts, espn-scoreboard.ts, strategy-advisor.ts
public/spectrum/    # the original Edge Spectrum Plotly viz, served static at /spectrum/index.html
Versions/ Data/ Docs/ Screenshots/   # preserved Edge Spectrum archives
```

## Adding a new tool (the whole recipe)

1. Add one entry to `TOOLS` in `src/tools.ts` (`slug`, `title`, `blurb`, `icon`, `href`, `kind`, `status`, `accent`).
2. Then, by `kind`:
   - `route` → build the page component and add its `<Route>` in `src/App.tsx`.
   - `static` → drop the page under `public/<slug>/` and point `href` at `/<slug>/index.html`
     (Vite dev does **not** auto-serve a `public/` directory index — always link the explicit file).
   - `external` → just the URL; opens in a new tab.
3. New accent colors must be added to the literal `ACCENT` map in `Home.tsx` (Tailwind JIT needs the literal classes).

## Env / secrets

- `GEMINI_API_KEY` (Gemini advisor) + optional `APP_URL`. Loaded from `.env` locally (gitignored), and set
  in the Vercel project's env vars for production. **Never commit `.env`** — advisor stays server-side; do
  not move the key client-side.

## Conventions

- Strict TS; functional components + hooks; Tailwind; match existing `src/` style.
- The static `public/spectrum/` page is self-contained (Plotly + fonts via CDN, data inlined) — leave it as-is;
  a future task may port it into a React route.
- Local dev: `npm run dev` (binds `PORT`, default 3001). `npm run build` = `vite build` + esbuild-bundle `server.ts`.

## Branch workflow (PR flow)

Do **not** push directly to `main`. Work on `mike_desktop`, then open a **PR → `main`** (`gh pr create --base main --head mike_desktop`). Vercel builds a **preview deployment** for each PR — check that URL before merging. Merging to `main` deploys to production (`edge-spectrum.mikesailab.com`). Keep `mike_desktop` and `main` in sync after each merge (`git checkout mike_desktop && git merge main`).
