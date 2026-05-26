# Zentron Solutions — Brand & Visual Identity

Reference for design tokens, voice, and motifs. Sourced from the pitch deck (`docs/source/Idea-Pitch-Deck-v2.pdf`) and the Fair Rate Engine slide (`docs/source/PHOTO-2026-05-20-09-41-27.jpg`).

## Voice

Confident, plainspoken, evidence-led. We don't sell — we cite. Every claim has a number behind it.

| Do | Don't |
|---|---|
| "Both sides see the same range." | "Revolutionize your influencer marketing!" |
| "Avg release: under 48h." | "Lightning-fast payouts ⚡" |
| "1 in 3 followers on top-tier creators are bots." | "Influencer fraud is a huge problem" |
| Italicize the accent word in display headings | Use ALL CAPS for emphasis |
| Use `×` (multiplication) between paired concepts | Use `&` or `+` |

## Color

All tokens live in `src/app/globals.css` under `:root` and `.dark`.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--ink` | `oklch(0.18 0.01 60)` | `oklch(0.97 0.005 80)` | Headings, body text, dark CTAs |
| `--paper` | `oklch(0.985 0.005 80)` | `oklch(0.14 0.005 60)` | Page background |
| `--surface` | `oklch(0.96 0.008 75)` | `oklch(0.19 0.008 60)` | Card, secondary, muted |
| `--brand` | `oklch(0.66 0.19 36)` ≈ `#E85B27` | `oklch(0.7 0.2 38)` | Accent (highlights, rules, primary CTA on dark) |
| `--brand-foreground` | `oklch(0.985 0.005 80)` | `oklch(0.14 0.005 60)` | Text on `--brand` |
| `--brand-soft` | `oklch(0.95 0.04 50)` | `oklch(0.28 0.07 40)` | Faint brand-tinted backgrounds |

### Color usage rules

- Orange is for **accent only** — never large surfaces. Top-rule on cards, italic accent words, primary-on-dark CTA, gauge fills, dimension highlight bars.
- Dark sections (`bg-ink text-paper`) carry the orange best — use them for highlight panels (Zentron Way escrow card, Scale pricing tier, final CTA section).
- Light sections use ink-on-paper with the orange reserved for one or two accent moments per viewport.
- Never use orange for body copy. Never combine orange with destructive (red).

## Typography

| Role | Token | Stack |
|---|---|---|
| Display (h1, h2, h3, `.font-display`) | `--font-serif` | `Charter, "Iowan Old Style", "Source Serif Pro", Georgia, ui-serif, serif` |
| Body | `--font-sans` | `var(--font-inter), ui-sans-serif, system-ui, sans-serif` |
| Mono | `--font-mono` | `ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace` |

### Display headings

- Always serif, always with `letter-spacing: -0.02em`
- Mix roman + **italic** for accent words within the same headline
- Use `text-balance` for hero and section headings to avoid orphan words
- Sentence case, not title case (matches editorial tone)

Examples:

> The trust layer between *brands × creators.*
> Six steps from *brief to paid.*
> Three revenue streams. *No surprises.*

### Body

- `text-base` (16px) leading-relaxed for prose
- `text-sm` for cards, captions, list items
- `text-[11px] uppercase tracking-[0.18em]` for eyebrows and labels
- `tabular-nums` on any number column (scores, prices, percentages)

## Layout motifs

These show up across the landing page and should carry into the app:

1. **Numbered sections.** Every section opens with `01 · LABEL` eyebrow.
2. **Thin orange top-rule.** Every card has a `h-px bg-brand` strip on its top edge.
3. **Inset → bleed on hover.** Top-rule grows from `inset-x-6` (or `inset-x-7`) to `inset-x-0` on hover — implies activation.
4. **Generous whitespace.** Sections breathe at `py-24` mobile, `lg:py-32`+ desktop.
5. **Italic accent words.** One accent word per heading, italicized in `--brand`.
6. **Stat cards.** Three-column grids with display-serif numbers and small uppercase eyebrows above.
7. **Dark hero panels.** Inverse-colored ink panels for vision/CTA/highlight tiers.

## Components & primitives

Use the shadcn primitives in `src/components/ui/`. Add the `brand` Button variant for orange CTAs:

```tsx
<Button asChild variant="brand" size="lg">
  <a href="#waitlist">Become a launch partner</a>
</Button>
```

Available variants: `default` (ink), `brand` (orange), `outline`, `ghost`, `secondary`, `destructive`, `link`.

## Logo & wordmark

Until the official lockup lands, the wordmark in `src/components/marketing/wordmark.tsx` is canonical:

> ● *Zentron* Solutions

- Orange dot, italic "Zentron", roman "Solutions"
- Serif font, tracking tight
- Three sizes: `sm`, `md`, `lg`

## Imagery

- No stock photography on the marketing site.
- Charts and data viz preferred over decorative imagery.
- When we add screenshots, frame them in `rounded-2xl border border-border bg-card` with the orange top-rule treatment.

## Don'ts

- No emojis in marketing copy. No exceptions.
- No gradients beyond subtle orange glow under hero / CTA blocks.
- No drop shadows beyond the brand shadow utility (`shadow-[0_8px_30px_-12px_oklch(0.18_0.01_60_/_0.15)]`).
- No rounded-full buttons. We use `rounded-md` and `rounded-2xl` only.
- No display fonts other than the serif stack defined above.
