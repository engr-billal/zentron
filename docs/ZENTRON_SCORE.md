# Zentron Score — Specification

> The pricing moat. A composite 0–100 score across five dimensions that beats follower-count-only pricing.
> Stub computation in MVP v0.1, real computation in Phase 2.

## Why

Follower count alone is a trap. A creator with 30K engaged followers can outperform one with 500K disengaged. The Score captures the signals brands actually care about and turns them into a single number plus a suggested fair-rate range.

Both sides see the same range. Creators set their rate within it. Brands know what fair looks like before anyone talks.

---

## The five dimensions

| # | Dimension | What it measures | Weight |
|---|---|---|---|
| 01 | Audience Size | Reach band — the floor | 0.20 |
| 02 | Engagement | Quality of attention — the multiplier | 0.25 |
| 03 | Niche Premium | Market-driven category multiplier | 0.20 |
| 04 | Platform | Format weight (long-form > short-form > stories) | 0.15 |
| 05 | Track Record | On-time, on-brief delivery history — the moat | 0.20 |

Weights sum to 1.0. Subject to tuning after Phase 5 review data lands.

---

## Dimension 01 — Audience Size

Maps total followers (across primary platform) to a band, then to a base score.

| Band | Followers | Base score |
|---|---|---|
| `nano` | 1K – 10K | 60 |
| `micro` | 10K – 100K | 72 |
| `mid` | 100K – 500K | 82 |
| `macro` | 500K – 1M | 90 |
| `mega` | 1M+ | 95 |

Bands also drive UI grouping in discovery filters.

---

## Dimension 02 — Engagement

```
engagement_rate = (likes + comments + saves + shares) / followers
```

Mapped to a 0–100 score with diminishing returns above the platform median:

| Engagement rate | Score |
|---|---|
| < 0.5% | 30 |
| 0.5–1% | 50 |
| 1–2% | 70 |
| 2–4% | 85 |
| 4–8% | 92 |
| > 8% | 96 |

Engagement is the multiplier — a `nano` creator at 8% beats a `macro` at 0.4%.

---

## Dimension 03 — Niche Premium

Some niches command higher rates because they convert better. Multiplier applied to the base, capped to keep the final score in 0–100.

| Niche | Multiplier |
|---|---|
| Finance | 3.0× |
| B2B / Tech | 2.5× |
| Beauty | 1.5× |
| Lifestyle | 1.0× |
| Other (default) | 1.0× |

The multiplier is applied to the **suggested rate range**, not to the score itself. The score column for this dimension is normalized: `min(100, 50 * multiplier)`.

| Multiplier | Score |
|---|---|
| 1.0 | 50 |
| 1.5 | 75 |
| 2.5 | 100 (capped) |
| 3.0 | 100 (capped) |

---

## Dimension 04 — Platform

Format matters. Long-form and owned-audience formats price higher because attention is denser.

| Platform / format | Score |
|---|---|
| YouTube long-form (>8min) | 95 |
| Podcast | 90 |
| YouTube Shorts | 80 |
| Instagram Reels | 78 |
| TikTok | 72 |
| Instagram static post | 68 |
| Instagram Stories | 55 |
| Twitter/X | 55 |
| LinkedIn | 70 |

For creators on multiple platforms, take the score of their `primary_platform`.

---

## Dimension 05 — Track Record

Zero by default for new creators (no completed campaigns). Updated after every completed contract via Phase 5 reviews.

```
track_record = base
             + on_time_bonus
             + on_brief_bonus
             + rating_bonus
             - dispute_penalty
```

| Component | Range |
|---|---|
| Base (new creators) | 50 |
| On-time bonus | up to +20 (rolling avg of last 10 campaigns) |
| On-brief bonus | up to +15 (rolling avg) |
| Rating bonus | up to +15 (avg of brand reviews) |
| Dispute penalty | up to −30 (count of disputes resolved against creator) |

Capped at 0–100.

---

## Final score

```
final_score = round(
  audience_size_score * 0.20 +
  engagement_score    * 0.25 +
  niche_score         * 0.20 +
  platform_score      * 0.15 +
  track_record_score  * 0.20
)
```

Displayed as `<final_score>/100`. Anything above 90 is "Top 1%". Above 94 is "Top 0.4%" (per the pitch deck hero).

---

## Suggested rate range

The Score determines visibility and trust. The **range** is what both sides actually negotiate within.

```
base_rate_cents = (
  audience_size_floor[band] *
  engagement_multiplier(engagement_rate) *
  platform_multiplier(primary_platform)
) * niche_multiplier[niche]

suggested_min_cents = round(base_rate_cents * 0.85)
suggested_max_cents = round(base_rate_cents * 1.35)
```

Stored in `creator_scores.suggested_min_cents` and `creator_scores.suggested_max_cents`.

### `audience_size_floor` (USD cents, single-deliverable reference)

| Band | Floor |
|---|---|
| nano | $150 |
| micro | $600 |
| mid | $2,500 |
| macro | $9,000 |
| mega | $40,000 |

### `engagement_multiplier`

Linear ramp from 0.7× (at 0.5%) to 1.6× (at 8%+).

### `platform_multiplier`

Indexed at 1.0 for Instagram Reels (the modal format). YouTube long-form 1.4×, Podcast 1.3×, TikTok 0.9×, Stories 0.7×.

### Niche multiplier

Same table as Dimension 03 — applied to the rate, not the score.

---

## Implementation

All scoring lives in `src/lib/scoring/` as **pure functions** — no React, no I/O. This is the moat; it must be testable to four decimal places.

```text
src/lib/scoring/
├── audience-band.ts          # followers → band
├── engagement-score.ts       # rate → 0–100
├── niche-multiplier.ts       # niche → multiplier
├── platform-score.ts         # platform → 0–100
├── track-record.ts           # reviews → 0–100
├── zentron-score.ts          # combines all five + suggested range
└── __tests__/                # 100% coverage required
```

```ts
// src/lib/scoring/zentron-score.ts (signature for Phase 1 stub)
export type ScoreInputs = {
  followers: number;
  engagementRate: number;
  niche: Niche;
  platform: Platform;
  completedCampaigns: number;
  onTimeRate?: number;
  onBriefRate?: number;
  avgRating?: number;
  disputeCount?: number;
};

export type ScoreResult = {
  audienceSizeBand: AudienceBand;
  engagementScore: number;
  nicheScore: number;
  nicheMultiplier: number;
  platformScore: number;
  trackRecordScore: number;
  finalScore: number;
  suggestedMinCents: number;
  suggestedMaxCents: number;
};

export function computeZentronScore(input: ScoreInputs): ScoreResult;
```

---

## Versioning

The scoring algorithm is versioned. Store the version in `creator_scores.algo_version`. Bump on every weight or formula change. Never silently rewrite history — recompute on demand and write a new row.

| Version | Notes |
|---|---|
| `v0` | Stubbed in MVP v0.1 — manual platform inputs, no track record |
| `v1` | Phase 2 launch — real platform data ingestion, scoring runs nightly |
| `v2` | Post-Phase 5 — track record signal added |

---

## Open questions

- Should we expose the per-dimension breakdown to brands or just the final score? (Lean toward: yes, transparency builds trust)
- Should creators be able to dispute their score? (Probably no — too gameable. Allow dispute of underlying data instead.)
- How often does the algorithm recompute? (Nightly batch + on-demand after platform refresh seems right)
- How do we cold-start Track Record for established creators migrating in? (Possibly: allow self-attestation backed by external evidence, admin-verified)
