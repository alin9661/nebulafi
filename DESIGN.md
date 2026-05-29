# Design System — Nebulafi

> **Memorable thing:** "This looks like serious financial software, not a hackathon dApp."

Every visual decision in this codebase must serve that line. When in doubt, ask: *would this ship in Bloomberg Terminal or Carta? Or does it look like another crypto dashboard?*

---

## Product Context

- **What this is:** A blockchain treasury management dApp for the NYU Blockchain Lab. Multi-signature governance, treasury operations, sponsorship-flow management, reimbursements, member management.
- **Who it's for:** NYU eboard members (students), accountable to a university and to a major sponsor (Aptos Labs). Not crypto-native maxis. They want to feel like they're operating real financial software.
- **Space/industry:** Crypto treasury + DAO governance tooling. Peers: Safe{Wallet}, Tally, Realms, Squads, Aragon.
- **Project type:** Web dApp — dashboard-led app pages plus marketing/governance reading views.
- **Reference posture:** The Financial Times, Bloomberg Markets, Carta, Tally (the institutional governance leader). NOT Realms, NOT Squads, NOT typical crypto-dashboard aesthetic.

---

## Aesthetic Direction

- **Direction:** Editorial / Magazine.
- **Decoration level:** Minimal. Typography and whitespace carry the personality. No gradients, no glassmorphism, no neon, no decorative blobs, no purple, no centered hero with floating widgets.
- **Mood:** Calm authority. Treasury data should feel like reading a financial publication, not playing with a crypto dashboard.
- **Light mode is the default.** Dark mode ships as a real alternate, not an afterthought, but light is the canonical experience.
- **Reference sites:** [tally.xyz](https://www.tally.xyz/explore) (institutional governance), [Bloomberg Markets](https://www.bloomberg.com/markets), [The Financial Times](https://www.ft.com).

### Deliberate departures from category norms

1. **Light-mode-first** in a dark-mode-default category. Bloomberg/Carta posture, not crypto-dashboard posture.
2. **Serif display typeface (Fraunces)** in a sans-only dApp category. Editorial authority on page titles.
3. **Aptos coral as the singular accent**, used surgically — only on primary CTAs and active states. Chain-identity signature no peer has.

---

## Typography

Fonts are loaded from Google Fonts (`Fraunces`, `Geist`, `Geist+Mono`).

| Role | Font | Notes |
|------|------|-------|
| **Display / Hero** | Fraunces 500, variable opsz axis (use `opsz: 144` at large sizes for warmth) | Page titles, governance proposal titles, marketing hero |
| **Section title** | Fraunces 500 | H2-level section heads inside app pages |
| **Body** | Geist Sans 400, 16px / line-height 1.6 | Default body text, paragraph copy |
| **UI / Labels** | Geist Sans 500, 11px, `letter-spacing: 0.1em`, `text-transform: uppercase` | Field labels, eyebrow text, table column heads |
| **Data / Tables** | **Geist Mono** with `font-feature-settings: 'tnum'; font-variant-numeric: tabular-nums;` | EVERY numeric value: balances, amounts, percentages, block numbers, addresses, vote tallies. Non-negotiable. |
| **Inline code / addresses** | Geist Mono | Hash truncations, contract addresses, transaction hashes |

### Scale

| Token | Size | Use |
|-------|------|-----|
| `text-2xs` | 11px | Eyebrows, labels (with tracking) |
| `text-xs` | 12px | Captions, meta, helper text |
| `text-sm` | 13px–14px | UI controls, secondary copy |
| `text-base` | 16px | Body |
| `text-lg` | 18px | Lead paragraphs, mono data |
| `text-xl` | 22px | Lead italic (Fraunces) |
| `text-2xl` | 28px | KPI value (mono) |
| `text-3xl` | 32px | Section title (Fraunces) |
| `text-4xl` | 36px | Governance proposal title (Fraunces) |
| `text-5xl` | 48–56px | Page title (Fraunces, opsz 144) |

### Loading strategy

Use `<link rel="preconnect">` to both `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin), then a single `<link>` to the Google Fonts CSS endpoint with all three families and the required weights. Self-host only if performance metrics demand it.

### Forbidden fonts

Inter, Roboto, Arial, Helvetica, Open Sans, Lato, Montserrat, Poppins, Space Grotesk, `system-ui`, `-apple-system` as primary display or body. Comic Sans, Papyrus, Lobster, Impact, Courier New for body. If a third-party widget forces a system font, override it.

---

## Color

### Approach
Restrained. **One signature accent (Aptos coral) + warm neutrals.** Semantic colors are present but used only where they carry meaning.

### Light mode (default)

| Token | Value | Role |
|-------|-------|------|
| `--background` | `#FAF8F4` | Warm cream page background |
| `--surface` | `#FFFFFF` | Cards, tables, panels — pure white on cream for calm contrast |
| `--ink` | `#0F1419` | Primary text — warm near-black, never pure `#000` |
| `--ink-muted` | `#5E6166` | Secondary text, labels, meta |
| `--ink-faint` | `#8A8E94` | Footer, captions, disabled |
| `--border` | `#E8E2D6` | Subtle 1px dividers — warm beige, not gray |
| `--border-strong` | `#D6CFC1` | Input borders, emphasised dividers |
| `--accent` | `#FF5733` | **Aptos coral.** Primary CTAs and active states ONLY. |
| `--accent-hover` | `#E84F2E` | Hover for accent |
| `--accent-tint` | `#FFF1ED` | Coral pill backgrounds, focus rings |
| `--success` | `#2E7D5C` | Forest green — sober, not crypto-bright |
| `--success-tint` | `#E8F1ED` | Success pill backgrounds |
| `--warning` | `#B8860B` | Sober goldenrod |
| `--warning-tint` | `#F5EFDD` | Warning pill backgrounds |
| `--error` | `#B8434A` | Muted brick — distinguishable from accent coral |
| `--info` | `#3B5C8C` | Deep navy |
| `--info-tint` | `#E8EEF6` | Info pill backgrounds |

### Dark mode (alternate)

| Token | Value |
|-------|-------|
| `--background` | `#0F1115` |
| `--surface` | `#1A1D23` |
| `--ink` | `#F2EDE3` (warm off-white) |
| `--ink-muted` | `#9CA3AF` |
| `--ink-faint` | `#6B7280` |
| `--border` | `#2A2E36` |
| `--border-strong` | `#3A3F4A` |
| `--accent` | `#E84F2E` (slightly desaturated coral) |
| `--accent-hover` | `#FF5733` |
| `--accent-tint` | `#2A1A14` |
| `--success` | `#4FA67D` |
| `--warning` | `#D4A53A` |
| `--error` | `#D86068` |
| `--info` | `#6B8AC4` |

Dark mode is a real redesign of surfaces — saturation reduced 10–20% on the accent. Do not just invert lightness.

### Coral discipline (the single most important rule)

Aptos coral `#FF5733` appears in these places only:
1. The primary CTA button on each page (the single "do the thing" action — `Cast vote`, `Sign transaction`, `Create proposal`).
2. The active sidebar nav item (left border indicator, or text + icon).
3. The "Voting" status pill (the moment a decision is open).
4. Focus rings on inputs (`box-shadow: 0 0 0 3px var(--accent-tint)`).
5. The middle-dot separator in the `NEBULAFI` wordmark — the only "logo decoration" in the entire system.

**That is the entire list.** Coral never appears on chart fills, background gradients, secondary buttons, hover states for non-accent elements, or anywhere else. Over-deploying coral dilutes the system. When tempted, ask: *would removing this coral make the page less usable?* If no, remove it.

---

## Spacing

| Token | Value |
|-------|-------|
| `--space-2xs` | 2px |
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--space-3xl` | 64px |

- **Base unit:** 4px.
- **Density:** Comfortable, not compact. Treasury data is dense enough — readability over density. Generous line-height (1.6 on body), real gutters between cards (16–24px), real padding inside cards (24px).
- **Max content width:** 1280px on dashboards, 760px on governance reading views.

---

## Layout

- **Approach:** Hybrid. Grid-disciplined for dashboards and app pages. Editorial (single-column, generous gutters, larger type) for governance proposal reading views, marketing/landing, member onboarding.
- **App page structure:** Left sidebar nav (~240px) on cream background → main content area on cream background with white cards.
- **Grid:** 12-column at `≥1280px`, 8-column at `≥768px`, single-column on mobile.
- **Border radius:** Hierarchical scale — `--radius-sm: 4px` (buttons, inputs), `--radius-md: 6px` (cards, panels), `--radius-lg: 8px` (modals, larger surfaces). Pills use `border-radius: 999px`. **Do not** apply a single bubble-radius everywhere — that's an AI-slop signal.
- **Borders over shadows.** Cards use a 1px `--border` line, not box-shadows. Editorial discipline.

---

## Motion

- **Approach:** Minimal-functional. Only motion that helps comprehension.
- **Easing:** `ease-out` for enter, `ease-in` for exit, `ease-in-out` for moves.
- **Duration:** micro 50–100ms (hover, focus), short 150–250ms (state transitions), medium 250–400ms (modals, drawers), long 400–700ms (page transitions only).
- **Forbidden:** Scroll-driven decoration, parallax, infinite loops, decorative entrance animations. Numbers don't dance.

---

## Component conventions

- **Buttons:** Three variants. `btn-primary` (coral fill, white text — *one per page*). `btn-secondary` (white surface, ink text, `--border-strong` border). `btn-ghost` (transparent until hover, then `--accent-tint` background and coral text).
- **Status pills:** Always paired with a count when one exists (`Voting 3/4`, `Awaiting 2/4`). Pill colors map to semantic tokens — `voting` → accent, `awaiting` → warning, `executed` → success, `info` → info. Counts inside pills are mono with tabular-nums.
- **Tables:** Right-align all numeric columns. Mono font with tabular-nums on numeric cells. Header rows use the UI-label style (11px uppercase tracked). Subtle 1px row separators in `--border`. Avoid zebra striping.
- **Allocation bars:** Thin (4px height) `--border` track with a `--ink-muted` fill — never coral, never colored. Allocation bars are data, not decoration.
- **Inputs:** White-on-cream background, `--border-strong` border, coral focus ring via `box-shadow: 0 0 0 3px var(--accent-tint)`.
- **Alerts:** Left-border-only treatment (3px solid semantic color) over a tinted background. No icons inside the alert body — alerts are textual.
- **Captions:** Use Fraunces italic at 14px, `--ink-muted`. Steals visual authority from financial press captions.
- **Wordmark:** `NEBULAFI` in Fraunces 500 small-caps with a coral middle-dot separator (`·`) — the only "logo decoration" anywhere in the system.

---

## Live preview

A live HTML preview of this system rendered on real Nebulafi screens exists at:

```
/tmp/design-consultation-preview-nebulafi.html
```

(Local-only; regenerate with `/design-consultation`.) Open it to see the system applied to a Treasury Overview dashboard, governance reading view, type specimens, palette, and components.

---

## Implementation notes for `globals.css`

The current `src/app/globals.css` uses default shadcn neutral HSL tokens. To adopt this system:

1. Replace the `:root` block with the **Light mode** values above (convert hex → HSL only if you must; CSS supports both).
2. Replace the `.dark` block with the **Dark mode** values.
3. Add font loading to `src/app/layout.tsx` (Fraunces, Geist, Geist Mono via `next/font/google`).
4. Update `tailwind.config.ts` `fontFamily` to expose `font-display: Fraunces`, `font-sans: Geist`, `font-mono: Geist Mono`.
5. Audit `src/components/Dashboard.tsx` (the 104k monolith) — that's where the biggest visual transformation happens.

---

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-27 | Initial design system created via `/design-consultation` | Memorable thing: "serious financial software, not a hackathon dApp." Three risks: light-mode-first, Fraunces serif display, Aptos coral as singular accent. Grounded in peer research of Safe, Tally, Realms, Squads. |
