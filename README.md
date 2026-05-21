# Pressure Drop Calculator PWA v1.1.1 — Responsive English UI

Industrial pipe pressure drop calculator with a guided engineering workflow.

## Main updates

- Responsive desktop layout: mobile remains single-column, while PC/tablet browsers expand into a wider card/grid layout.
- English-only interface, labels, messages, and PWA text.
- Guided workflow: Fluid → Calculation Method → Pipe & Flow → Fittings → Output.
- Darcy-Weisbach is available for all fluids.
- Hazen-Williams is available only for water service and uses L/D / equivalent length basis.
- Gas, air, and steam calculations are shown as preliminary incompressible estimates.
- Output breakdown separates Straight Pipe / Fittings / Elevation / Total for Darcy-Weisbach.
- Output breakdown separates Friction / Elevation / Total for Hazen-Williams.
- Pure-method fitting logic: L/D method only uses L/D data; K-method only uses K data.
- Fittings without selected-method data are shown as Not calculated.
- Input validation box before calculation.
- Velocity check and engineering limitation notes.
- PWA icons included and cached by the service worker.
- Footer signature included.

## Deployment

Deploy the folder contents to Netlify, GitHub Pages, Vercel, or any static hosting service.

## App signature

Pressure Drop Calculator v1.1.1  
Developed by Osman Saftari · Engineering Tools
