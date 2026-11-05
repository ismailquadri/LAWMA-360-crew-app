# Expanded Street Scenarios

## Goal
Add a broader, presentation-ready sequence of property types and scan outcomes while preserving the rugged zero-touch workflow.

## Experience
- Rotate the active stop through homes, apartments, shops, offices, and public facilities.
- Show each property type and its expected collection context directly in the route list.
- Use deterministic outcomes so presenters can reliably demonstrate valid collection, arrears, already collected, wrong-zone tag, and damaged-tag handling.
- Keep hardware-trigger, Spacebar, audio, vibration, offline caching, photo proof, and supervisor override behavior intact.

## Implementation
- Replace the fixed three-property list with a typed scenario sequence and active scenario state.
- Add dedicated result screens for non-photo exceptions, with clear field actions and return-to-route controls.
- Make camera and arrears details reflect the active property, then advance the route after each resolved outcome.
- Add compact styling for property-type labels and exception states without reducing glove-friendly controls.
- Verify the complete scenario cycle and current build status.
