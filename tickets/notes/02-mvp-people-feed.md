# MVP — People Feed (Home View)

**Phase:** MVP (Q2 2026)
**Platform:** iOS (iPhone) only

The primary mobile view. A vertically scrolling card-based feed optimized for one-thumb use. This is what users see when they open the app. In MVP, it surfaces people sorted alphabetically and by recency of addition.

> **Implementation Status:** Core feed is implemented with search, sort, cards, empty state, filter by circle, and pull-to-refresh. Missing: swipe/long-press card actions, and navigate-to-canvas from search.

## Tasks

### Feed Layout

- [x] Implement vertically scrolling card-based list
- [x] Design person card component (avatar, name, category badge, subtitle)
- [ ] Optimize card sizing and spacing for one-handed use
- [x] Set People Feed as the default home screen on app launch

### Sorting & Filtering

- [x] Sort by alphabetical order (default)
- [x] Sort by recency of addition
- [x] Filter by circle/category
- [x] Implement pull-to-refresh

### Card Interactions

- [x] Tap card to open Person Detail View
- [ ] Swipe actions on cards (e.g., quick-connect, quick-note)
- [ ] Long-press for context menu

### Search Integration

- [x] Search bar at top of feed
- [x] Real-time filtering as user types
- [ ] Navigate to person on canvas from search results

### Empty States

- [x] Design empty state for new users with no people added
- [x] Call-to-action to import contacts or add first person
