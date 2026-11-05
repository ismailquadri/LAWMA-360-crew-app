# Rugged Crew Field App Prototype

## Goal
Build a polished interactive desktop presentation of the crew app inside a realistic rugged Android handheld, with controls that demonstrate the complete field workflow without requiring a backend.

## Experience
- Frame the app in an industrial handheld with scanner housing, side controls, status lights, and a large physical trigger; Spacebar mirrors the trigger.
- Provide a presenter control rail for network conditions and operator/supervisor mode while keeping the device screen focused and glove-friendly.
- Use the specified safety palette, large touch targets, strong typography, direct sunlight contrast, and restrained sensory feedback.

## Operator flow
1. Four-digit PIN or NFC badge login.
2. Depot manifest download for 150 properties.
3. Battery and scanner diagnostics, then route start.
4. Street route list and zero-touch scan loop.
5. Alternate scan outcomes between valid collection and arrears for demonstration.
6. Valid scans flash green, chime, and open a fast camera capture view with timestamp and GPS stamp.
7. Arrears scans flash red, buzz, block collection, and offer a supervisor override.
8. Offline/2G scans save immediately to a visible local queue; restoring 4G/Wi-Fi automatically syncs and updates the tally.

## Supervisor flow
- Switch to Chidi’s fleet dashboard.
- Show zone completion, crew battery health, connectivity, and pending record counts.
- Keep the same rugged terminal status bar and mode controls.

## Technical details
- Implement as a single client-side React prototype at `/` using deterministic state and Web Audio feedback.
- Add keyboard handling for Spacebar, simulated network transitions, timed manifest/sync progress, camera state, and mode switching.
- Define all visual colors and typography through semantic tokens in the global stylesheet.
- Add route-specific metadata and preserve the existing TanStack application structure.
- Verify the full flow and check both desktop presentation and a narrower viewport for clipping or overlap.
