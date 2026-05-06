# v0.5-scm - 2026-04-16

- Added animated "Back to Top" floating button for better dashboard navigation.
- Integrated component into the Root Layout for site-wide availability.

# Release Notes: v0.5

Release date: 2026-04-12

## Summary

This release delivers the Story 2 fuel-type comparison filter on the Gas Price Viewer landing page.

## Highlights

- Added URL-driven fuel-type filter tabs for regular, midgrade, and premium.
- Preserved the selected fuel type when the location search changes.
- Filtered and sorted nearby station results by the active fuel type.
- Replaced the default starter landing page with a Gas Price Viewer entry experience.

## Validation

- `npx -y pnpm lint`
- `npx -y pnpm build`
- `npx -y pnpm test:unit`
- `npx -y pnpm test:integration`

## Notes

- The release also includes supporting helper updates for fuel-type parsing and URL generation.
- The current branch is tagged as `v0.5` for this release.
