# Docko — location-verified visual journaling

A premium, bento-grid SaaS for internship logging: students capture photo + GPS + time, mentors verify digitally, admins manage the institution.

## Design system

- Off-white canvas, soft raised cards ("soft skeuomorphism"): gentle top highlight, layered soft shadows, 16–24px radii, hairline borders.
- Accents: gentle blue (primary), soft emerald (verified), warm orange (pending/nudge), muted red (rejected). No saturated colors, no rainbow gradients.
- Typography: Inter variable (heading + body), tight confident headings, generous line height.
- Motion: 180–300ms, custom ease, transform/opacity only. Hover lift, button press, progress rings, animated counters, skeletons, toast. Full `prefers-reduced-motion` support.
- All tokens live in `src/styles.css` (oklch) — no hardcoded colors in components. Shared primitives: `BentoCard`, `StatCard`, `ProgressRing`, `StatusPill`, `EmptyState`, `Skeleton`.

## Pages

Public
- `/` — landing: hero, how-it-works (photo → GPS → time → note → submit), bento feature grid, roles, CTA.
- `/auth` — email/password + Google sign-in, role-aware onboarding.

Student (`_authenticated/`)
- `/app` — dashboard bento: today's progress, hours logged, streak ring, weekly activity, recent photos, journey map, quick actions, notifications.
- `/app/log` — capture flow: live camera (HTML5), auto GPS + reverse-geocoded address + timestamp, note, hours, teammate tagging, submit.
- `/app/timeline` — visual story feed of entries (photo, place, time, status, mentor comments) + calendar month view.
- `/app/map` — Google Map of all entries with markers and journey path.
- `/app/portfolio` — shareable summary of the internship journey + print/export view.

Mentor
- `/mentor` — dashboard: pending approvals, students at a glance, engagement charts.
- `/mentor/verify` — verification feed with batch approve/reject, comment, nudge, geo check.
- `/mentor/teams` — teams, assign students, student detail drilldown.

Admin
- `/admin` — institution analytics overview.
- `/admin/users` — users + roles; `/admin/teams` — teams/departments/courses; `/admin/settings` — institution + export center.

## Backend (Lovable Cloud)

Tables: `profiles`, `user_roles` (separate table + `has_role()` security-definer), `institutions`, `departments`, `courses`, `teams`, `team_members`, `entries` (photo path, lat/lng, address, captured_at, note, hours, status), `entry_collaborators`, `entry_comments`, `nudges`, `streaks` (derived).
- Storage bucket `entry-photos` (private) with owner + mentor-of-team read policies.
- RLS everywhere: students see own + team-collab entries; mentors see assigned teams via `has_role`; admins see institution scope. GRANTs on every new table.
- Auth: email/password + Google, `profiles` auto-created via trigger.
- Reverse geocoding through the managed Google Maps connector (server-side, gateway).
- Demo seed rows so every dashboard looks alive on first load.

## Performance & accessibility

- Route-level code splitting (default), lazy camera + map modules behind `ClientOnly`, virtualized timeline, memoized aggregates, `aspect-*` wrappers to prevent layout shift, generated WebP/AVIF imagery.
- Semantic landmarks, one `<main>` in the layout, labeled icon buttons, visible focus rings, ≥44px tap targets, token-based contrast.
- Per-route `head()` metadata (title/description/og) on every public route.

## Build order

1. Enable Cloud; migrations, roles, storage, RLS, seed data.
2. Design tokens + bento primitives + motion utilities.
3. Landing + auth.
4. Student: dashboard, capture, timeline/calendar, map, portfolio.
5. Mentor: dashboard, verification feed, teams.
6. Admin: analytics, users, teams, settings/export.
7. Responsive pass (5 breakpoints), a11y pass, perf pass.

## Notes

- Runs on TanStack Start (React 19 + TS + Tailwind v4) with server functions instead of Next.js/Edge Functions — same capabilities.
- Google Maps via the managed connector (I'll prompt to link it).
- Offline mode/PWA and PDF export: portfolio ships as a print-optimized view first; full offline queue + PDF are a follow-up pass to keep the bundle light.
