# Pressure Drop Calculator PWA v1.1.3 — Trial Findings Update

## Implemented in this release

### Finding 1 — Reference-Based Velocity Guideline

- Retains the selectable velocity guideline basis added in v1.1.2.
- Displays calculated velocity, reference basis, reference range/value, and advisory evaluation.
- Shows a non-blocking warning if calculated velocity is outside a selected recommended range.

### Finding 2 — Distinguish app examples from user input

- Removed active pre-filled example values from straight pipe length, elevation difference, and flow rate fields.
- These fields now show gray example placeholders and require the user to enter actual data.
- Fitting quantity fields use a gray `0` placeholder rather than active pre-filled quantities.
- Custom fluid properties and custom roughness now use placeholders and require actual user input.
- Hazen-Williams C is labelled as a `Reference value` until edited; after editing it is labelled as `User input`.

### Finding 3 — In-app refresh/update control

- Added `Refresh App / Check for Update` button in the footer.
- When online, the button checks the service worker, removes the app cache, and reloads current application files.
- When offline, it prompts the user to connect to the internet before checking for an update.

## PWA update

- Updated service worker cache version to `pd-calc-v1.1.3`.

## Reference basis

*Introduction to Process Engineering and Design*, Table 5.1 — Recommended Fluid Velocities.
