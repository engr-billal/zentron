# Zentron Solutions — Product Roadmap

> Single source of truth for what we're building, in what order, and what's done.
> When a feature ships, move it from `pending` to `shipped` with a date.

**Last updated:** 2026-05-27
**Current phase:** Phase 1 — MVP v0.1
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

### 1.2 Auth & onboarding `later`

| Feature | Status | Notes |
|---|---|---|
| Supabase project setup + env wiring | `later` | `lib/supabase/{client,server,middleware}.ts` |
| Supabase Auth — email/password | `later` | Sign-in, sign-up, email verification |
| Supabase Auth — Google OAuth | `later` | Single provider for v0.1 |
| Role-select screen | `later` | After first sign-up: brand or creator |
| Brand onboarding wizard | `later` | Company, website, industry, team size, logo, billing country |
| Creator onboarding wizard | `later` | Handle, primary platform, niches, languages, base rate, country |
| `middleware.ts` route gating | `later` | Auth → onboarding → app, mirroring accounting-os-fe pattern |

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

### 1.7 DB schema + RLS `later`

| Feature | Status | Notes |
|---|---|---|
| `supabase/migrations/0001_init.sql` | `later` | `profiles`, `brand_profiles`, `creator_profiles`, `creator_platforms`, `creator_scores`, `briefs`, `brief_invitations` |
| `supabase/migrations/0002_rls.sql` | `later` | Owner-only writes, public reads for creator profiles, service-role bypass for scoring |
| Generated TS types via `supabase gen types` | `later` | `src/types/database.ts` |

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
