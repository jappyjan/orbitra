# v1.0 — Smart Connectivity Engine

**Phase:** v1.0 Full Launch (Q3 2026)

The Smart Connectivity Engine transforms Orbitra from a static diagram into an active relationship nurture tool.

## Calendar Sync

- [ ] iOS: Integrate with EventKit for calendar access
- [ ] Android: Integrate with CalendarProvider
- [ ] Request calendar permissions with clear explanation
- [ ] Read calendar events on-device only (no upload of raw data)
- [ ] Auto-match calendar attendees to Orbitra people by email/name
- [ ] Auto-detect interactions from calendar events
- [ ] Create timeline entries from matched calendar events
- [ ] Handle recurring events appropriately
- [ ] Background sync on schedule (not just on app open)

## Manual Interaction Logging

- [ ] "I talked to X today" quick-action via swipe or button
- [ ] Log interaction type: call, message, in-person, email, other
- [ ] Add optional note to manual interaction log
- [ ] Interaction logged updates relationship health score immediately

## Interaction Processing

- [ ] All calendar/email data processed on-device only
- [ ] Only encrypted interaction records (person ID + timestamp + type) synced to server
- [ ] Raw calendar/email data is never uploaded
- [ ] Match quality scoring for attendee → person matching
- [ ] Handle ambiguous matches (prompt user to confirm)
