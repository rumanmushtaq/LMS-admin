# Admin panel — chat & charts visual redesign

**Date:** 2026-08-23 · **Scope:** `admin/` only (the screenshot is the admin moderation chat; the charts are the admin dashboard growth chart and the security traffic chart).

## Goal

Make the admin chat and the dashboard charts look considered and premium while staying
inside the existing stack (NextUI v1 tokens + Tailwind v4 utilities + ApexCharts), with
no new dependencies, no behaviour changes, and dark mode handled through the tokens the
app already has.

## Design language — "quiet premium"

- **One accent.** Brand purple `#7047EB` (NextUI `$primary`) is the only saturated
  colour used for UI state (own bubbles, active row, unread badges, send button).
  Red is reserved for moderation/danger (flagged, block, disconnected).
- **Surfaces over fills.** Cards are `$backgroundContrast` with a 1px `$border`
  hairline and 16px radius. Elevation is a soft shadow on hover only. Large
  saturated gradient blocks are removed (they read loud and hide the numbers).
- **Type.** Inter, already loaded. Headings 16–22px/600–700, body 13–14.5px,
  meta 11–12px. Hero numbers 32px/700 with proportional figures.
- **Ink from tokens.** Text never wears a data/series colour. `$text`, `$accents8`,
  `$accents7`, `$accents6` carry primary → muted.
- **Motion.** 150–200ms ease-out only: bubble enter, hover lift, typing dots,
  connection pulse. All disabled under `prefers-reduced-motion`.

## Chart system (`components/charts/theme.ts`)

Shared by the growth chart and the traffic chart so they read as one system.

- **Palette (validated with the dataviz validator, light `#fff` and dark `#16181d`,
  all checks pass):** slot 1 purple `#6D4AE8`, slot 2 teal `#0EA5A4`, slot 3 amber
  `#C98500`, slot 4 red `#D03B3B`. Teachers = purple, Students = teal. Traffic:
  Requests = purple, Failed logins = amber, Blocked = red.
- **Marks.** 2px round lines, area wash ≈ 14% → 0, hover marker 5px with a 2px
  surface ring, no drop shadows, no dashed grid — solid 1px hairlines one step
  off the surface, no vertical gridlines.
- **Legend + direct labels.** A custom React legend (line key + name + latest
  value) above the plot; Apex's own legend is off. The growth chart labels the
  endpoint of each line; when the two ends converge the labels split
  above/below so they never collide.
- **Tooltip.** One tooltip for every series at the hovered X: value leads
  (bold, tabular), series name follows, keyed by a short coloured line.
  Series/category names are HTML-escaped before insertion.
- **Dark mode.** Ink/surface/grid picked from `useTheme().isDark` as hex (Apex
  writes SVG attributes, so CSS variables are not relied on).

## Dashboard (`components/home/*`)

- Layout becomes a centred 1200px column with real gutters instead of the
  narrow centred block with a large dead left margin.
- `CardBalance1/2/3` become thin wrappers over a single `StatTile`: icon in a
  tinted rounded square, label + caption, 32px value, delta pill (green when
  positive, neutral "No change" otherwise — fixes the wrapping "↑ 0 this month"
  pill), and a status-dot hint line. Accents: purple / teal / amber.
- The third tile is relabelled **New signups · this week** because that is the
  number it is fed (`recentSignups`); "Total Transactions" was wrong.
- The chart component owns its card (title, subtitle, legend) so the dashboard
  no longer draws a separate heading + box around it.
- Out of scope, flagged: the "Latest Users" table still renders demo data from
  `components/table/data.ts`.

## Chat (`pages/chat.tsx`, `components/chat/*`, `lib/chat/presentation.ts`)

- **Shell.** Page header with title/subtitle and a "Live / Reconnecting…" pill
  (pulsing dot). One bordered card holds a fixed 340px sidebar + fluid thread.
- **Sidebar.** Segmented control (Chats · Flagged, each with a count), a search
  field that filters by participant name or last message, and rows with:
  initials avatar tinted by role (tutor teal, student purple, admin amber) —
  stacked pair for two-person threads — name, relative time, last-message
  preview, and a purple unread count. Active row gets a purple wash + left rail.
  Flagged items are cards with a red top rule, the quoted message, the sender,
  and Resolve / Block actions.
- **Thread.** Header shows the people, online/typing state and role chips.
  Canvas is a neutral `$accents0` surface with a faint dot grid (the external
  texture image request is removed). Messages group into runs: first bubble of
  a received run carries the sender's name + role chip (the admin often watches
  a tutor↔student thread, so *who said it* matters), last bubble carries the
  avatar and the tail. Own bubbles are purple with white text; received are
  surface + hairline. Time (and ticks / pending clock) floats inside the bubble.
  A typing bubble with three dots appears while a participant types.
- **Composer.** Pill input with the emoji button inside, purple circular send
  button that dims when empty instead of collapsing to zero width.
- **Empty state.** Layered circle icon, "Pick a conversation", one-line hint.
- Helpers for ids/names/initials/role tones/date labels live in
  `lib/chat/presentation.ts` so the two components stay presentational.

## Findings during implementation

- **Tailwind utilities were losing to NextUI's baseline.** Tailwind v4 emits
  utilities in `@layer utilities`; NextUI's `CssBaseline` injects unlayered
  `span { font-size: inherit; color: inherit; font-weight: inherit }`,
  `p {…}`, `h1–h6 {…}`, `button, input {…}`. Unlayered beats layered, so
  every `text-[11px]`, `text-white`, `font-bold` on those elements was ignored
  (that is why the timestamps in the original screenshot were body-sized).
  `styles/globals.css` now sets `font-size / font-weight / line-height /
  letter-spacing / color` (and `margin` on p, h*, li) to `revert-layer` via
  `html :is(span, p, …)` — specificity (0,0,2) beats the baseline's bare
  element rules, stays below any class, so NextUI components are untouched.
- **ApexCharts drops a point annotation that sits exactly on the y-axis max**,
  so the growth chart sets an explicit "nice" max ≈ 15% above the data.
- Bubble timestamps use a trailing inline spacer + absolutely positioned time
  (a floated time before the paragraph does not count toward the bubble's
  intrinsic width, so the bubble shrank and the text wrapped under it).

## Non-goals

LMS-web (student/tutor app) chat and earnings charts; the admin Latest Users
table; any data or socket behaviour.

## Verification

`npm test` (Vitest, added 2026-08-23), `npm run typecheck` and `npm run lint` in
`admin/`, plus headless screenshots of `/`, `/chat` (thread open) and `/security`
in light and dark, reviewed by eye.

Unit tests cover the pure logic this work introduced — `lib/chat/presentation.ts`
(ids, names, initials, role tones, dates, people/title, search filter, sender
resolution, run boundaries), `components/charts/theme.ts` (tooltip escaping and
ordering, base options), `components/charts/growth-options.ts` (nice axis max,
endpoint label placement), `lib/charts/describe-span.ts`, and server-rendered
`StatTile` / avatar components. Each test was checked against a deliberate
mutation of the behaviour it names.
