# Pressure Drop Calculator PWA v1.1.5 — Saturated Steam Pressure Input

## Steam calculation improvement
- Added steam pressure input in Define Pipe & Flow when Fluid = Steam.
- Flow rate remains in Define Pipe & Flow.
- Added pressure unit conversion for barG, barA, kg/cm²G, kg/cm²A, MPaG, MPaA, kPaG, and kPaA.
- For saturated steam, density is estimated from the entered pressure using internal saturation-table interpolation.
- The calculated steam density is used for velocity preview, Reynolds number, Darcy-Weisbach pressure drop, and velocity guideline check.

## Current limitation
- Saturated steam property estimate only.
- Superheated steam is not yet modeled; verify detailed steam design against project criteria or dedicated steam property tools.
