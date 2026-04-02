# MVP — Circle Groups (Browse View)

**Phase:** MVP (Q2 2026)
**Platform:** iOS (iPhone) only

A categorized view that organizes people into visual groups (circles). Each circle represents a category. Users tap into a circle to see its members as a grid of avatar cards.

> **Implementation Status:** Core circle browsing, detail view, and person-circle assignment are implemented. Missing: representative avatar previews show up to 3 (done), but no "4th+" indicator. All other key features are done.

## Tasks

### Default Circles

- [x] Create default circle categories: Family, Friends, Work, Community, Other
- [x] Assign distinct colors to each default circle
- [x] Display circles as tappable visual cards on the browse screen

### Circle Browse View

- [x] Implement circle grid/list layout showing all circles
- [x] Show circle name, color, and member count on each card
- [x] Show representative avatars (up to 3-4) on circle card preview

### Circle Detail View

- [x] Tap circle to open detail view showing all members as avatar grid
- [x] Display member name and avatar photo in grid cells
- [x] Tap member to navigate to Person Detail View
- [x] Show circle name and color as header

### Person-Circle Assignment

- [x] Assign a person to one or more circles during creation
- [x] Change circle assignment from Person Detail View
- [x] Support a person belonging to multiple circles
- [x] Unassigned people default to "Other" circle
