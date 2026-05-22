# Pressure Drop Calculator PWA v1.1.4 — Update Refresh Fix & Unified Header

## Corrective update
- Replaced the v1.1.3 manual cache-clearing `Refresh App / Check for Update` mechanism.
- Adopted the update prompt pattern used by Pipe Support Span:
  - Check for updates
  - New version available banner
  - Update now activation via `SKIP_WAITING`
  - Reload only after service worker controller changes
- Added a one-time bridge to update affected v1.1.3 clients.
- Versioned static CSS/JavaScript/icon URLs to reduce mixed-version asset risk.

## Visual alignment
- Added an Engineering Toolkit hero/header style consistent with Pipe Support Span.
- Added trial badge, subtitle, and preliminary-use warning strip.

## Retained trial features
- Reference-based velocity guideline and advisory warnings.
- Improved clarity for example/default inputs.
- English-only application interface.
