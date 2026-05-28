# Zentron Solutions — Product Roadmap

> Single source of truth for what we're building, in what order, and what's done.
> When a feature ships, move it from `pending` to `shipped` with a date.

**Last updated:** 2026-05-28
**Current phase:** Phase 3 shipped (smart contracts + milestone schedule, 2-sided in-platform signing). Next: Phase 4 escrow (Stripe Connect + milestone status updates + payment release).
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
| Supabase project setup + env wiring | `done` 2026-05-27 | Project `zentron` in `eu-west-2`, `@supabase/ssr` factories in `src/lib/supabase/{client,server,session,admin}.ts` |
| Supabase Auth — email/password | `done` 2026-05-27 | Sign-in, sign-up, email verification via `/api/auth/callback` |
| Supabase Auth — Google OAuth | `next` | Single provider, add as a second action on sign-in page |
| Role-select screen | `done` 2026-05-27 | `/role-select` updates `profiles.role`; creator drops auto-stub and routes to wizard |
| Brand onboarding wizard | `done` 2026-05-28 | 3-step wizard at `/onboarding/brand`: Company, Targeting defaults, Billing. Persists default_niches/platforms/audience_bands to brand_profiles |
| Creator onboarding wizard | `done` 2026-05-28 | 3-step wizard at `/onboarding/creator`: Identity, Work, Platforms. Creates creator_profile + creator_platforms + creator_score atomically |
| `proxy.ts` route gating | `done` 2026-05-28 | Redirects unauth → /sign-in, no-role → /role-select, role+!onboarded → /onboarding/<role>, onboarded users skip /onboarding |
| Forgot password flow | `later` | – |
| Email template customization | `later` | Custom SMTP (Resend) before public launch |
| Leaked-password protection | `next` | Toggle on in Supabase Auth dashboard (advisor WARN; one click) |

### 1.3 Brand dashboard `done`

| Feature | Status | Notes |
|---|---|---|
| Role-aware dashboard nav | `done` 2026-05-28 | Topbar with Briefs/Score/Profile/Platforms/Invitations switched by role |
| Briefs list page with status filter | `done` 2026-05-28 | `/dashboard/briefs` — cards grid, Drafts/Open/Closed filter, empty state |
| Brief creation — 5-step wizard | `done` 2026-05-28 | Basics → Audience → Deliverables → Budget → Terms |
| Brief detail view (read-only summary) | `done` 2026-05-28 | `/dashboard/briefs/[id]` with status-aware actions (Edit/Publish/Close/Reopen/Delete) |
| Brief edit (drafts only) | `done` 2026-05-28 | `/dashboard/briefs/[id]/edit` reuses wizard pre-filled |
| Brand overview with stats | `done` 2026-05-28 | 4 stat cards (Drafts/Open/Closed/Invitations sent) + recent briefs grid |
| Empty states | `done` 2026-05-28 | First-brief empty state on overview + list page |

### 1.4 Creator dashboard `done`

| Feature | Status | Notes |
|---|---|---|
| Role-aware `/dashboard` shell | `done` 2026-05-28 | Branches to CreatorOverview or BrandOverview based on `profiles.role` |
| Score card (slide 06 visual) | `done` 2026-05-28 | `src/app/dashboard/_components/score-card.tsx` shows final score + 5 weighted dimensions + fair-rate range |
| Profile editor | `done` 2026-05-28 | `/dashboard/profile` — bio, niches, languages, country, primary platform, base rate. Recomputes score on save |
| Platforms manager | `done` 2026-05-28 | `/dashboard/platforms` — inline add/edit/delete. Each mutation recomputes score |
| Profile + Platforms summaries on overview | `done` 2026-05-28 | Quick-view cards on `/dashboard` with "Edit" / "Manage" links |
| Invitations inbox on overview | `done` 2026-05-28 | Top section shows N pending invitations as cards when present (hidden when empty) |
| `/dashboard/invitations` full inbox | `done` 2026-05-28 | Pending/Accepted/Declined filter + detail at `/dashboard/invitations/[brief_id]` |
| Accept/Decline/Withdraw actions | `done` 2026-05-28 | Server actions update `brief_invitations.status` + responded_at |

### 1.5 Brand-side creator discovery `done`

| Feature | Status | Notes |
|---|---|---|
| Match preview on brief detail | `done` 2026-05-28 | `src/lib/matching/` shortlists top-8 creators per brief with match score + reasons |
| Match-score heuristic (v0) | `done` 2026-05-28 | 60% creator final_score + 20% niche match + 20% platform match, filtered by audience band |
| Brand → creator invitations | `done` 2026-05-28 | Send/withdraw invite from brief detail page; writes brief_invitations row |
| Dedicated /discover page (browse outside of a brief) | `later` | Lands when we have more breadth needs |
| Real algorithmic matching engine | `later` | Phase 2 — same `shortlistForBrief` interface, real algo behind it |

### 1.6 Foundational scoring `done`

| Feature | Status | Notes |
|---|---|---|
| `src/lib/scoring/types.ts` | `done` 2026-05-28 | Niche, Platform, AudienceBand, ScoreInputs, ScoreResult, DIMENSION_WEIGHTS, ALGO_VERSION |
| Pure functions: audience-band, engagement-score, niche-multiplier, platform-score, track-record | `done` 2026-05-28 | All zero-side-effect, return shaped results |
| `zentron-score.ts` orchestrator | `done` 2026-05-28 | Weighted combination + suggested rate range computation |
| `persist.ts` — recomputeAndSaveScore | `done` 2026-05-28 | Single source of truth for every score recompute (onboarding, profile edit, platform CRUD) |
| Score breakdown component | `done` 2026-05-28 | `src/app/dashboard/_components/score-card.tsx` + `score-dimension-row.tsx` |
| Unit tests | `later` | Deferred; vitest setup is the obvious next test slice |

### 1.7 DB schema + RLS `done`

| Feature | Status | Notes |
|---|---|---|
| Migrations versioned in `supabase/migrations/` | `done` 2026-05-28 | All 5 files committed; `supabase migration list` shows local + remote in sync. File-first workflow going forward (no more MCP write-mode) |
| Migration `init_schema` | `done` 2026-05-27 | 7 enums + 6 tables + `set_updated_at` trigger + indexes |
| Migration `init_rls` | `done` 2026-05-27 | All 6 tables RLS-enabled with role-aware policies |
| Migration `profile_trigger` | `done` 2026-05-27 | `handle_new_user()` security-definer trigger on `auth.users` |
| Migration `advisor_fixes` | `done` 2026-05-27 | Wrapped `auth.uid()` in `(select auth.uid())` across policies |
| Migration `add_creator_scores` | `done` 2026-05-28 | 7th table for the moat; RLS public-read for discovery, owner-write |
| Migration `briefs_rls_include_invitees` | `done` 2026-05-28 | Creators can read briefs they've been invited to, even after status=closed |
| Migration `brand_targeting_defaults` | `done` 2026-05-28 | `brand_profiles.default_niches/platforms/audience_bands` for wizard pre-fills |
| Migration `add_contracts_and_milestones` | `done` 2026-05-28 | Phase 3 schema: `contracts` + `milestones` + 2 enums + RLS |
| Migration `milestones_split_write_policies` | `done` 2026-05-28 | Advisor fix: separate INSERT/UPDATE/DELETE so SELECT only evaluates one policy |
| Generated TS types | `done` 2026-05-28 | `src/types/database.ts` via MCP `generate_typescript_types` (read-only) |

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

## Phase 3 — Smart contracts `done`

Standardized digital agreements, signed in-platform.

| Feature | Status | Notes |
|---|---|---|
| Contracts table + RLS | `done` 2026-05-28 | `contract_status` enum (draft/pending_creator/active/declined/cancelled/completed), party-only SELECT, brand-only INSERT, draft-only milestone writes |
| Milestones table + RLS | `done` 2026-05-28 | `milestone_status` enum (pending/submitted/approved/rejected/released), gated through contract; status updates beyond `pending` land with Phase 4 escrow |
| 4-step contract wizard | `done` 2026-05-28 | Scope → Schedule → Milestones (live sum check) → Terms; "Split evenly" helper |
| Brand sends contract from brief detail | `done` 2026-05-28 | `Send contract` per opted-in invitation; pre-fills wizard with brief data |
| Brand-side status actions | `done` 2026-05-28 | Edit/Send/Delete (draft), Withdraw (pending), Mark complete/Cancel (active) |
| Creator-side sign + decline | `done` 2026-05-28 | Pending contracts surface on creator overview; Sign promotes status to active |
| Cancel from either side | `done` 2026-05-28 | Pending or active contracts; optional reason captured |
| /dashboard/contracts list | `done` 2026-05-28 | Role-aware list with 7-status filter; ContractCard shared by both sides |
| Detail page + milestone breakdown | `done` 2026-05-28 | Read-only summary + role-specific action sidebar + milestone list |
| PDF export of signed contract | `later` | – |
| Real e-signature integration (DocuSign etc.) | `later` | – |
| Counter-offers from creator | `later` | – |
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
