# MVP — Graph Canvas (Explore View)

**Phase:** MVP (Q2 2026)
**Platform:** iOS (iPhone) only

The signature Orbitra experience: an interactive, zoomable graph where people are nodes and relationships are edges. On phones, the canvas is optimized for touch with larger tap targets, simplified labels, and a focus-mode that expands a selected node's neighborhood.

> **Implementation Status:** The Explore tab exists but only shows a placeholder ("Interactive relationship graph coming soon"). No graph engine, touch interactions, or focus mode have been implemented.

## Tasks

### Graph Rendering Engine

- [ ] Implement 2D graph layout engine (force-directed or similar)
- [ ] Render nodes (people) as circular avatars with name labels
- [ ] Render edges (relationships) as lines between connected nodes
- [ ] Support dynamic node positioning and layout recalculation
- [ ] Handle graphs up to 500+ nodes performantly

### Touch Interactions

- [ ] Implement pinch-to-zoom on the canvas
- [ ] Implement pan/scroll to navigate the canvas
- [ ] Implement tap-on-node to select a person
- [ ] Implement long-press on node for context menu (edit, delete, connect)
- [ ] Implement drag-to-reposition nodes
- [ ] Optimize tap targets for one-handed phone use (minimum 44pt)

### Focus Mode

- [ ] Tap a node to enter focus mode — expand and highlight that node's neighborhood
- [ ] Dim/fade non-connected nodes when in focus mode
- [ ] Tap background or back gesture to exit focus mode

### Node Management

- [ ] Add a new person as a node on the canvas
- [ ] Delete a node (with confirmation)
- [ ] Connect two nodes to create a relationship edge
- [ ] Remove a connection between two nodes
- [ ] Display relationship type labels on edges (optional toggle)

### Visual Polish

- [ ] Color-code nodes by circle/category (Family, Friends, Work, etc.)
- [ ] Show avatar photos on nodes when available
- [ ] Animate node transitions (add, remove, rearrange)
- [ ] Support dark mode
