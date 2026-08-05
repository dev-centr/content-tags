# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-08-04

### Added

- Initial monorepo: `@content-tags/core`, `astro`, `solid`, `react`, `next`.
- JSON5 taxonomy load/validate, hierarchical tree, post↔tag indexing, slug helpers.
- Astro Zod field + static path builders; Solid/React TagList/TagTree; Next App Router helpers.
- Vanilla demo page.

### Fixed

- Astro `tagStaticPaths` returns slash-joined rest params (Astro rejects `string[]` for `[...tag]`).
