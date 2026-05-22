# Pressure Drop Calculator PWA v1.1.4 — Trial Findings Update

Industrial pipe pressure drop calculator with a guided engineering workflow.

## Main capabilities

- Darcy-Weisbach calculation for available fluids.
- Hazen-Williams calculation for water service using L/D / equivalent length basis.
- Guided workflow: Fluid → Calculation Method → Pipe & Flow → Fittings → Output.
- Output breakdown for pipe/friction, fittings, elevation and total pressure drop.
- Pure-method fitting logic: L/D method only uses L/D data; K-method only uses K data.
- Reference-based velocity guideline selection using *Introduction to Process Engineering and Design*, Table 5.1 — Recommended Fluid Velocities.
- Non-blocking advisory warning when calculated velocity is outside a selected recommended range.
- Responsive desktop/mobile layout and English-only app interface.

## Implemented trial findings

1. **Reference-Based Velocity Guideline** — service-based guideline selection, comparison status, and advisory warnings.
2. **Input Clarity** — line data example values now appear as gray placeholders and are not treated as entered input; reference/default values are labelled clearly.
3. **Refresh App / Check for Update** — footer control to clear app cache and reload the latest deployed files while online, intended to help mobile users after an update.

## Deployment

Deploy the folder contents to GitHub Pages, Netlify, Vercel, or another static hosting service. Upload the files and folders inside this package so `index.html`, `manifest.json`, and `sw.js` remain at the site root.

## App signature

Pressure Drop Calculator v1.1.4  
Developed by Osman Saftari · Engineering Tools


## v1.1.4 — Update Refresh Fix & Unified Header

- Replaced the cache-clearing refresh behavior with a safe service-worker update prompt pattern.
- Added a one-time upgrade bridge for clients still using the affected v1.1.3 cache.
- Added versioned CSS/JavaScript asset URLs to prevent mixed static assets after an update.
- Aligned the hero/header design with the Engineering Toolkit / Pipe Support Span visual language.
- Retained velocity guideline and input clarity improvements introduced during the trial.
