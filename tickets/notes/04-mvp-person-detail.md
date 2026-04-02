# MVP — Person Detail View

**Phase:** MVP (Q2 2026)
**Platform:** iOS (iPhone) only

Opened as a full-screen modal (bottom sheet on phone). Designed for quick scanning and editing.

> **Implementation Status:** Person detail view is implemented as a full-screen page (not bottom sheet modal). Shows header, contact info, notes, tags, connections, and delete. Edit screen works. Missing: bottom-sheet presentation, add/remove tags UI, rich text notes, add connection from detail view, and remove connection UI.

## Tasks

### Detail View Layout

- [x] Header section: large photo, name, category badges
- [x] Notes section: expandable text area for personal notes
- [x] Connections section: list of connected people in the graph
- [x] Tags display and management
- [ ] Implement as bottom sheet / full-screen modal on iPhone

### Person Data Fields

- [x] Name (first, last) — required
- [x] Photo (from contacts or camera/library)
- [x] Phone number(s)
- [x] Email address(es)
- [x] Category/circle assignment
- [x] Custom tags (free-form)
- [x] Notes (rich text) — *plain text only, no rich text formatting*

### Edit Functionality

- [x] Edit person name, photo, contact info
- [ ] Add/remove tags
- [ ] Edit notes with basic text formatting
- [x] Change circle/category assignment
- [x] Save changes with validation

### Connections Management

- [x] Display list of connected people
- [x] Tap a connection to navigate to their detail view
- [ ] Add new connection from detail view (link to another person)
- [ ] Remove a connection

### Delete Person

- [x] Delete person with confirmation dialog
- [x] Cascade delete: remove all edges connected to this person
- [x] Update canvas and feed after deletion
