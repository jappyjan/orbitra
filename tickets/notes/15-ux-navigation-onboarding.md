# Cross-Cutting — UX, Navigation & Onboarding

**Phase:** All phases

> **Implementation Status (MVP scope):** Tab navigation with 3 tabs (Home/Explore/Circles) is implemented. Floating "+" button works. Passphrase setup and unlock screen implemented (auth-gated navigation via `useSegments`/`useRouter` redirect). No profile/settings, no onboarding carousel, no tablet layout. Web output uses SPA mode (`"output": "single"`) due to native module incompatibility with Node.js static rendering.

## Mobile Navigation (Phone)

- [x] Bottom tab bar with primary destinations:
  - [x] Home (People Feed)
  - [x] Explore (Graph Canvas) — *placeholder only, no graph*
  - [x] Circles (Circle Groups)
  - [ ] Timeline (History) — v1.0
- [x] Floating "+" action button for quick-add person (always accessible)
- [x] Passphrase setup screen on first launch (encryption onboarding)
- [x] Unlock screen with passphrase entry + biometric option
- [x] Auth-gated navigation (redirect to unlock when locked)
- [ ] Profile/settings via avatar tap in top-left corner
- [ ] Follow iOS/Android navigation conventions per platform

## Tablet Navigation

- [ ] Sidebar navigation (collapsible) with same 4 destinations + Settings
- [ ] Split-view: e.g., Circle Groups on left + Person Detail on right
- [ ] Graph Canvas full-screen with person detail panel on right

## Onboarding Flow (MVP/v1.0)

- [ ] 3-screen value proposition carousel:
  - [ ] "See your world"
  - [ ] "Never lose touch"
  - [ ] "Private by design"
- [ ] Create account (email + password) — v1.0 (skip in MVP)
- [ ] Set encryption passphrase with visual metaphor ("a key only you hold")
- [ ] Import prompt: native contact picker (optional)
- [ ] Quick categorize: assign imported people to circles
- [ ] Connect prompt: "Do any of these people know each other?" tap-to-connect flow
- [ ] Calendar/email sync prompt — v1.0
- [ ] Reminder setup: set global default frequency — v1.0
- [ ] Done → People Feed as home screen

## Glossary

| Term | Definition |
|------|-----------|
| Node | A person in the graph |
| Edge | A connection/relationship between two nodes |
| Canvas | The interactive 2D graph visualization |
| People Feed | Mobile-first card-based home view |
| Circle Group | A category of relationships (Family, Work, etc.) |
| Health Score | Computed 0–1 metric for connection maintenance |
| Smart Connectivity Engine | Calendar sync, email sync, interaction tracking, reminders |
| Zero-Knowledge | Server operator cannot decrypt user data |
| CRDT | Conflict-free Replicated Data Type for sync |
