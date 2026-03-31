# v1.0 — Relationship Health Score & Smart Reminders

**Phase:** v1.0 Full Launch (Q3 2026)

## Relationship Health Score

- [ ] Compute health score per person (0.0–1.0)
- [ ] Display as colored ring around avatar in all views
- [ ] Algorithm: Recency (50%) + Frequency (30%) + User Priority (20%)
  - [ ] Recency: days since last interaction, normalized against reminder frequency
  - [ ] Frequency: rolling 90-day interaction count vs. expected frequency
  - [ ] User Priority: manual strength rating (1–5)
- [ ] Thresholds: Green (≥ 0.7), Yellow (0.4–0.69), Red (< 0.4)
- [ ] Recalculate on app open and after each sync
- [ ] Score decays over time without interactions
- [ ] Score recovers when contact is made

## People Feed — Smart Sections

- [ ] "Reconnect" section: fading connections (low health score) at the top
- [ ] "Recent Interactions" section: people you recently connected with
- [ ] "Upcoming Birthdays" section
- [ ] "Recently Added" section
- [ ] Re-sort feed based on health scores

## Smart Reminders & Notifications

### Push Notification Infrastructure

- [ ] iOS: APNs integration
- [ ] Android: FCM integration
- [ ] Server-side notification scheduling (or local notifications with encrypted triggers)

### Reminder Types

- [ ] Reconnection nudges ("You haven't talked to Sarah in 3 months")
- [ ] Birthday reminders (3 days before + day of)
- [ ] Fading connection alerts (health score drops below threshold)
- [ ] Per-person reminder frequency: Weekly, Biweekly, Monthly, Quarterly, Yearly, None

### Reminder Settings

- [ ] Global default reminder frequency setting
- [ ] Per-person override for reminder frequency
- [ ] Quiet hours setting (e.g., no notifications 22:00–08:00)
- [ ] Notification deep-links to person detail view
- [ ] Snooze / dismiss actions on notifications
