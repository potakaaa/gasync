# Testing Strategy: Gas Price Viewer

This document defines the test types used for the Gas Price Viewer project and the runner choices that support them.

## Test Types

- Unit tests cover isolated logic such as price formatting, filtering rules, freshness thresholds, and event-tag validation.
- Integration tests cover multi-step flows across components and data boundaries, such as search, trend switching, event citations, and alert setup.
- Vitest is the default runner for both types, with React Testing Library used for component-level integration coverage.

## Runner Setup

- Use `vitest run --environment node --passWithNoTests` for unit coverage.
- Use `vitest run --environment jsdom --passWithNoTests` for integration coverage.
- Keep browser-facing assertions in React Testing Library so DOM behavior stays close to the user experience.

## Notes

- Prefer unit tests when a rule can be checked without rendering UI.
- Prefer integration tests when a change crosses component boundaries or depends on DOM interaction.