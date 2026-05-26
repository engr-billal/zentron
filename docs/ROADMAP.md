# Zentron Solutions — Product Roadmap

> Single source of truth for what we're building, in what order, and what's done.
> When a feature ships, move it from `pending` to `shipped` with a date.

**Last updated:** 2026-05-27
**Current phase:** Phase 1 — MVP v0.1 · foundation (1.7) and auth (1.2) shipped, dashboards (1.3, 1.4, 1.5) next
**Tech stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Supabase (planned) · Stripe Connect (planned)

---

## Status legend

- `done` — shipped and live
- `wip` — in progress this sprint
- `next` — picked up immediately after current sprint
- `later` — committed to phase, not started
- `idea` — captured for consideration, not committed

---

## Phase 0 — Foundation `done`

Scaffolding, brand identity, conventions. No user-facing product yet.

| Feature | Status | Notes |
|---|---|---|
| Next.js 16 + TS + Tailwind v4 scaffold | `done` 2026-05-26 | App Router, Turbopack, `src/` layout |
| shadcn/ui setup (new-york, neutral) | `done` 2026-05-26 | `components.json`, base CSS variables |
| Folder structure mirroring `accounting-os-fe` | `done` 2026-05-27 | `src/{app,components,hooks,lib,providers,store,types}` |
| Cursor rules: folder-structure, code-comments, build-quality | `done` 2026-05-27 | `.cursor/rules/*.mdc` |
| Zentron brand tokens in `globals.css` | `done` 2026-05-26 | `--ink`, `--paper`, `--surface`, `--brand`, `--brand-foreground`, `--brand-soft` |
| Brand `Button` variant | `done` 2026-05-27 | Orange CTA used on pricing + final CTA |
| Source materials preserved in `docs/source/` | `done` 2026-05-26 | Pitch deck v2, motivation letter, brand slide |

---

## Phase 1 — MVP v0.1 `wip`

The first thing prospects, brands, and creators can actually see and use.

### 1.1 Marketing site `wip`

| Feature | Status | Notes |
|---|---|---|
| Landing page composed of 11 sections | `done` 2026-05-26 | Hero, Marquee, TrustGap, Solution, HowItWorks, ZentronScore, Escrow, Pricing, Vision, CTA, Footer |
| Interactive Match Score card in hero | `done` 2026-05-26 | Animated 5-dimension bars, Top 0.4% badge |
| Interactive Zentron Score section | `done` 2026-05-26 | Hover/click switches active dimension, weighted bars recolor |
| Animated trust-gap counters | `done` 2026-05-26 | `$1.3B+`, `~70%`, `3–5×` count-up on scroll |
| Pricing page (3 plans) | `done` 2026-05-26 | 8% commission · $499 Scale · à la carte |
| Vision timeline (Y1/Y3/Y5 + TAM/SAM/SOM/CAGR) | `done` 2026-05-26 | – |
| Marketing-only sub-pages | `next` | `/for-creators`, `/for-brands`, `/pricing`, `/about`, `/contact` |
| `/legal/{privacy,terms,cookies}` pages | `later` | Required before public launch |
| Open-graph + Twitter card images | `later` | Generated `og:image` route handler |
| Sitemap + robots.txt | `later` | `next-sitemap` or static |
| Waitlist email capture | `next` | Stores email + role intent (brand/creator) in Supabase `waitlist` table |

### 1.2 Auth & onboarding `wip`

| Feature | Status | Notes |
|---|---|---|
| Supabase project setup + env wiring | `done` 2026-05-27 | Project `zentron` in `eu-west-2`, `@supabase/ssr` factories in `src/lib/supabase/{client,server,middleware,admin}.ts` |
| Supabase Auth — email/password | `done` 2026-05-27 | Sign-in, sign-up, email verification via `/api/auth/callback` |
| Supabase Auth — Google OAuth | `next` | Single provider, add as a second action on sign-in page |
| Role-select screen | `done` 2026-05-27 | `/role-select` creates `brand_profiles` or `creator_profiles` row |
| Brand onboarding wizard | `next` | Company, website, industry, team size, logo, billing country (currently auto-stub on role-select) |
| Creator onboarding wizard | `next` | Handle, primary platform, niches, languages, base rate, country (currently auto-stub) |
| `proxy.ts` route gating | `done` 2026-05-27 | `src/proxy.ts` (Next.js 16 renamed `middleware` → `proxy`) redirects unauth → /sign-in, no-role → /role-select |
| Forgot password flow | `later` | – |
| Email template customization | `later` | Custom SMTP (Resend) before public launch |

### 1.3 Brand dashboard `later`

| Feature | Status | Notes |
|---|---|---|
| App shell (sidebar + topbar) | `later` | `src/components/layout/` |
| Briefs list page | `later` | `src/app/(dashboard)/briefs/page.tsx` |
| Brief creation — multi-step form | `later` | Objective → audience → deliverables → budget → terms → review |
| Brief detail view (read-only summary) | `later` | – |
| Empty states + skeleton loaders | `later` | – |

### 1.4 Creator dashboard `later`

| Feature | Status | Notes |
|---|---|---|
| Profile editor | `later` | Bio, niches, languages, base rate |
| Platforms manager | `later` | Add/edit handles + follower counts (manual entry for v0.1) |
| Zentron Score panel (stub) | `later` | Uses pure functions in `lib/scoring/zentron-score.ts` |

### 1.5 Brand-side creator discovery `later`

| Feature | Status | Notes |
|---|---|---|
| Searchable, filterable creator list | `later` | Filters: niche, platform, country, follower band, score band |
| Match score badge (stub) | `later` | Static computation against brief targets |
| Pagination + empty state | `later` | – |

### 1.6 Foundational scoring `later`

| Feature | Status | Notes |
|---|---|---|
| `lib/scoring/zentron-score.ts` — pure functions | `later` | See `docs/ZENTRON_SCORE.md` for spec |
| Unit tests for scoring | `later` | Bands, multipliers, weights, suggested rate range |
| Score breakdown component | `later` | Used by Creator dashboard + Brand discovery |

### 1.7 DB schema + RLS `done`

| Feature | Status | Notes |
|---|---|---|
| Migration `init_schema` | `done` 2026-05-27 | 7 enums + 6 tables (`profiles`, `brand_profiles`, `creator_profiles`, `creator_platforms`, `briefs`, `brief_invitations`) + `set_updated_at` trigger + indexes |
| Migration `init_rls` | `done` 2026-05-27 | All 6 tables RLS-enabled with role-aware policies |
| Migration `profile_trigger` | `done` 2026-05-27 | `handle_new_user()` security-definer trigger on `auth.users` |
| Migration `advisor_fixes` | `done` 2026-05-27 | Wrapped `auth.uid()` in `(select auth.uid())` across policies; locked `set_updated_at` search_path; covered `briefs.brand_id` FK with index |
| Generated TS types | `done` 2026-05-27 | `src/types/database.ts` via `mcp.generate_typescript_types` |
| `creator_scores` table | `later` | Lands with Phase 2 matching engine when scoring goes live |

---

## Phase 2 — Matching engine `later`

Real algorithm replacing the v0.1 stubs.

| Feature | Status | Notes |
|---|---|---|
| Real Zentron Score computation | `later` | Async job that recomputes nightly + on platform-data refresh |
| Platform data ingestion — manual upload (CSV) | `later` | Brand-side admin tool for seeding creator stats |
| Platform data ingestion — Instagram Graph API | `later` | OAuth flow + scheduled refresh |
| Platform data ingestion — YouTube Data API | `later` | – |
| Platform data ingestion — TikTok API | `later` | – |
| Brief → shortlist algorithm | `later` | Top-N creators per brief, weighted by 5 dimensions |
| Creator opt-in flow | `later` | Notifications, accept/decline, response SLA |
| Brief invitations dashboard (creator side) | `later` | – |

---

## Phase 3 — Smart contracts `later`

Standardized digital agreements, signed in-platform.

| Feature | Status | Notes |
|---|---|---|
| Contract template builder | `later` | Scope, deliverables, exclusivity, usage rights, fees |
| Digital signing (e-signature stub or DocuSign) | `later` | Audit log per signature |
| Contract storage + versioning | `later` | Immutable record, downloadable PDF |
| Contract lifecycle states | `later` | `draft → sent → signed → active → completed → cancelled` |

---

## Phase 4 — Escrow & payments `later`

The trust mechanism. Funds locked at signing, released per milestone.

| Feature | Status | Notes |
|---|---|---|
| Stripe Connect onboarding (creators) | `later` | KYC, payout account, country handling |
| Stripe checkout for brand deposit | `later` | – |
| Milestone schema + UI | `later` | Per-contract milestones with deliverable + due date |
| Escrow hold on milestone creation | `later` | Stripe `payment_intent` with `manual` capture |
| Deliverable submission flow (creator) | `later` | Upload links, post URLs, attestation |
| Verification step (brand or auto) | `later` | Approve → release; reject → dispute |
| Payout release on verification | `later` | Avg target: under 48h |
| Webhooks: payment, payout, refund | `later` | `src/app/api/webhooks/stripe/route.ts` |
| 1099 / VAT-compliant statements | `later` | Per-creator earnings reports |

---

## Phase 5 — Disputes & reviews `later`

Closing the trust loop. Two-sided reviews feed the Track Record dimension.

| Feature | Status | Notes |
|---|---|---|
| In-platform dispute filing | `later` | Triggered from rejected verification |
| Dispute resolution workflow | `later` | 3-day brand response → 5-day Zentron mediation → escalation |
| Two-sided reviews | `later` | Brand reviews creator + creator reviews brand |
| Review feeds back into Track Record score | `later` | Weight in Dimension 05 |
| Admin dispute dashboard | `later` | Internal-only, role-gated |

---

## Phase 6 — Growth `later`

Monetization beyond the 8% commission.

| Feature | Status | Notes |
|---|---|---|
| Scale tier subscription (`$499/mo`, 3% commission) | `later` | Stripe Billing, role unlocks |
| Subscription self-serve management | `later` | Upgrade, downgrade, cancel |
| Referral program (10% off first collab) | `later` | Referral codes, attribution, payouts |
| Value-add services marketplace | `later` | Brief writing, strategy, performance reports, featured placements |
| Featured creator placements (paid) | `later` | Time-boxed boost in discovery |

---

## Phase 7 — Integrations `later`

Plug into the tools brands and creators already use.

| Feature | Status | Notes |
|---|---|---|
| Shopify app — sync campaign-attributed sales | `later` | OAuth + webhook ingest |
| HubSpot integration — sync creator contacts | `later` | – |
| Slack notifications | `later` | Brief invites, milestone events |
| Zapier connector | `later` | Public after v1 |
| Public REST API | `later` | – |

---

## Cross-cutting concerns

These run alongside every phase. Track gaps here.

| Area | Status | Notes |
|---|---|---|
| Accessibility audit (axe + manual keyboard nav) | `later` | – |
| i18n scaffolding | `later` | English-only at launch, then DE/AR |
| Analytics (PostHog or Plausible) | `later` | – |
| Error monitoring (Sentry) | `later` | Plugin already installed |
| Email infra (Resend or Postmark) | `later` | Transactional templates |
| Test setup (Vitest + Playwright) | `later` | – |
| CI/CD pipeline (GitHub Actions) | `later` | Build, lint, typecheck, test on PR |

---

## Idea bin

Captured but not committed. Don't build until validated.

- `idea` Performance-refund SLA (Y3 target from pitch deck)
- `idea` "Verified by Zentron" badge widget creators can embed off-platform
- `idea` Audience-health API for external campaign tools
- `idea` Group-buy briefs for SMB brands
- `idea` Creator coaching / academy module
- `idea` Affiliate-style commission for long-tail content (post-campaign sales)
