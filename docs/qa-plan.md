# QA Plan: Gas Price Viewer

This plan covers Sprint 1 validation for the Gas Price Viewer MVP. It is aligned with the [product backlog](backlog.md), [Sprint 1 plan](sprint-1-plan.md), and [risk register](risk-register.md).

## Purpose

QA verifies that the first release is accurate, stable, and understandable when prices move quickly. The main focus areas are price accuracy, data freshness, event citations, alert behavior, and consistency of event impact tags.

## In Scope

- Story 1: Nearby station price list
- Story 2: Fuel type comparison filters
- Story 3: 7-day and 30-day price trends
- Story 4: Price spike threshold alerts
- Story 6: World events feed with citations
- Story 11: Event impact tagging on spikes

## Out of Scope for Sprint 1

- Story 5: Map price markers
- Story 7: Regional price heatmaps
- Story 8: Favorite stations
- Story 9: Data export
- Story 10: Low-data mode

## Test Strategy

See [Testing Strategy](testing-strategy.md) for the unit and integration test definitions used in this plan.

### Functional Coverage

- Search by city and ZIP code.
- Verify station list ordering, fuel-type filtering, and preservation of the selected fuel type when location changes.
- Verify 7-day and 30-day trend views, range switching, and upward-momentum highlighting.
- Verify event feed source, date, and linkage to price trend periods.
- Verify alert creation, delivery, and disable flows.
- Verify impact tag categories, confidence values, and source citations.

### Data Quality Coverage

- Compare displayed prices against seeded provider data.
- Confirm timestamps and freshness warnings match expected thresholds.
- Validate event citations against approved sources.
- Exercise stale-data and fallback-provider scenarios.

### Regression and Compatibility

- Run smoke checks on desktop and mobile layouts.
- Check keyboard navigation for primary controls.
- Verify narrow-screen behavior and long station-name truncation.
- Perform a basic cross-browser pass in the supported staging browser set.

### Non-Functional Checks

- Validate staleness and outage handling.
- Check alert latency and retry behavior.
- Measure response times with normal and high-volume test data.
- Confirm accessibility basics: labels, focus order, contrast, and live-region updates for alerts.

## Test Environment

- Staging environment with seeded station, trend, event, and alert fixtures.
- Mock upstream provider for outage and stale-data scenarios.
- Test accounts for standard user, QA, and editor roles.
- Deterministic datasets for 7-day and 30-day trend comparisons.

## Roles

- QA lead: Vin Gerebise owns execution, defect triage, and final sign-off.
- DevOps lead: Hans Del Mundo keeps staging, mocks, and CI checks healthy.
- Feature owners fix defects and provide repro notes when needed.
- Docs lead: Ira Narisma records release notes and QA sign-off status.

## Entry Criteria

- Acceptance criteria exist for the story under test.
- A staging build is deployed successfully.
- Required fixtures and provider mocks are available.
- No open blocker remains from the previous QA run.

## Exit Criteria

- All in-scope stories pass acceptance checks.
- No unresolved severity 1 or severity 2 defects remain.
- Staleness, citation, and alert checks pass.
- Smoke regression passes on desktop and mobile.
- QA sign-off is recorded in the sprint notes.

## Defect Severity

- Severity 1: release blocker, data is wrong, or a core flow is unusable.
- Severity 2: major workflow failure with no acceptable workaround.
- Severity 3: moderate issue with a workaround.
- Severity 4: cosmetic or copy issue.

## Release Checklist

- Search and station list verified.
- Fuel filter persistence verified.
- Trend charts verified for 7-day and 30-day ranges.
- Event cards show approved citations.
- Alerts can be created, triggered, and disabled.
- Impact tags can be filtered and reviewed.
- Staleness warning appears when data ages past threshold.
- Mobile layout remains usable.

## Known Risks and Mitigations

- Upstream API outage: use a fallback provider and cached prices.
- Stale prices during breaking events: enforce freshness thresholds and warning states.
- Unverified event claims: require citations and editorial review.
- Inconsistent impact tags: use a shared tagging rubric and periodic QA audits.
- Delayed alerts: test retries and monitor delivery latency.

## Deliverables

- QA execution notes.
- Defect log with severity and owner.
- Regression checklist results.
- Final QA sign-off recommendation.