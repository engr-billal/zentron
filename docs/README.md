# Zentron Solutions — Docs

Living reference for the product, the domain, and the brand. Start here before writing code.

| Doc | What it covers | When to read |
|---|---|---|
| [ROADMAP.md](ROADMAP.md) | Phased feature catalog, status of every feature, idea bin | Before starting any work — pick from `next` or `wip`, update on ship |
| [DOMAIN.md](DOMAIN.md) | Core entities, table shapes, lifecycle states, naming rules | Before designing a schema, API, or any feature that introduces new entities |
| [ZENTRON_SCORE.md](ZENTRON_SCORE.md) | The 5-dimension scoring algorithm, weights, formula, suggested-rate logic | Before touching anything in `src/lib/scoring/` |
| [BRAND.md](BRAND.md) | Colors, fonts, voice, layout motifs, component usage | Before adding marketing copy or visual elements |
| [source/](source/) | Original pitch deck, motivation letter, brand slide | Reference only — don't link to from product UI |

## Process

- Every shipped feature → tick the box in `ROADMAP.md` and add a date.
- Every new entity → row in `DOMAIN.md` + a Supabase migration.
- Every change to scoring math → bump the version in `ZENTRON_SCORE.md` and write a migration that recomputes affected `creator_scores` rows.
- Every brand-token change → update `BRAND.md` and the corresponding `globals.css` block in the same PR.

## Where things live in code

```text
src/
├── app/                       # routes
├── components/
│   ├── marketing/             # landing-page sections
│   ├── ui/                    # shadcn primitives
│   ├── forms/                 # form helpers (when added)
│   └── layout/                # app shell (when added)
├── hooks/                     # cross-feature React hooks
├── lib/
│   ├── utils.ts               # cn()
│   ├── scoring/               # Zentron Score (pure functions)
│   ├── supabase/              # client/server/middleware factories (when added)
│   └── api.ts                 # axios instance (when added)
├── providers/                 # context providers
├── store/                     # Redux Toolkit
├── types/                     # cross-cutting types
└── middleware.ts              # route gating (when auth lands)
```

See [.cursor/rules/folder-structure.mdc](../.cursor/rules/folder-structure.mdc) for the full feature-folder convention.
