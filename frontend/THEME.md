# Shared portal theme

The buyer portal establishes a reusable look for the farmer/cooperative portal. Copy the shared tokens and UI components, then replace navigation and business content. **Terra** is a provisional name.

## Palette and type

All tokens live in `src/index.css`.

| Token | Value | Usage |
| --- | --- | --- |
| `--color-primary` | `#254e3b` | Primary actions and brand mark |
| `--color-background` | `#f7f8f3` | Warm workspace background |
| `--color-surface` | `#ffffff` | Cards, tables, dialogs, sidebar |
| `--color-text` | `#23372f` | Main text |
| `--color-muted` | `#717b70` | Secondary text |
| `--color-border` | `#e5e8de` | Light separators |
| `--color-accent` | `#e6eeaa` | Soft agricultural accent |
| `--radius-sm/md/lg` | `7px / 12px / 17px` | Controls, cards, dialogs |

Use the local Avenir/system sans-serif stack for interface text and Georgia for editorial headings and large metrics. No remote font requests or image assets are required. Illustrations use CSS and inline SVG.

## Reusable pieces

Import `src/index.css`, the relevant shared component rules in `src/App.css`, and exports from `src/components/ui.jsx`.

```jsx
<Button icon="plus">Request a contract</Button>
<Button variant="secondary">Cancel</Button>
<Badge tone="green">Active</Badge>
<StatusBadge status="Awaiting response" />
<EmptyState title="No requests yet" description="New requests appear here." />
```

Layout classes: `app-shell`, `sidebar`, `workspace`, `topbar`, `page-heading`, `panel`, `section-heading`, `supplier-grid`, and `table-scroll`. Component classes include `button`, `badge`, `search-field`, `detail-list`, and `modal-actions`.

Keep the same sidebar, top bar, rounded surfaces, restrained colors, state tags, and button hierarchy in both portals. Buyer navigation is Overview / Cooperatives / Contracts; farmer navigation can substitute its own destinations without changing the shell.

Dialogs handle Escape, initial focus, tab trapping, background scroll lock, and return focus. Maintain accessible labels, visible focus states, and reduced-motion behavior when reusing components. Mobile navigation appears below 760px; card grids collapse below 560px. Never communicate status through color alone.

## Sample data policy

Keep the demo banner and explicit sample labels until real services are integrated. “Documentation available” is different from independently verified sustainability certification. Do not present sample ratings, figures, or insurance commitments as verified or legally effective.
