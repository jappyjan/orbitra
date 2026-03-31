# MVP — Person Detail View

**Phase:** MVP (Q2 2026)
**Platform:** iOS (iPhone) only

Opened as a full-screen modal (bottom sheet on phone). Designed for quick scanning and editing.

## Tasks

### Detail View Layout

- [ ] Implement as bottom sheet / full-screen modal on iPhone
- [ ] Header section: large photo, name, category badges
- [ ] Notes section: expandable text area for personal notes
- [ ] Connections section: list of connected people in the graph
- [ ] Tags display and management

### Person Data Fields

- [ ] Name (first, last) — required
- [ ] Photo (from contacts or camera/library)
- [ ] Phone number(s)
- [ ] Email address(es)
- [ ] Category/circle assignment
- [ ] Custom tags (free-form)
- [ ] Notes (rich text)

### Edit Functionality

- [ ] Edit person name, photo, contact info
- [ ] Add/remove tags
- [ ] Edit notes with basic text formatting
- [ ] Change circle/category assignment
- [ ] Save changes with validation

### Connections Management

- [ ] Display list of connected people
- [ ] Tap a connection to navigate to their detail view
- [ ] Add new connection from detail view (link to another person)
- [ ] Remove a connection

### Delete Person

- [ ] Delete person with confirmation dialog
- [ ] Cascade delete: remove all edges connected to this person
- [ ] Update canvas and feed after deletion
