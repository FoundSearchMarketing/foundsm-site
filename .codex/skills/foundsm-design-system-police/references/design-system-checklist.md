# Design System Checklist

- Page starts with `modernHeroBlock` or `eventHeroBlock` and ends with `modernCtaBlock` or `formLandingBlock` when reviewing full page JSON.
- All sections use approved `_type` values from `references/component-catalog.md`.
- Token fields use approved token values only.
- No raw CSS, inline styles, arbitrary colors, custom font sizes, custom font weights, custom breakpoints, editor-owned responsiveness, or negative letter spacing.
- CTA labels are consistent and CTA URLs are real paths.
- Meaningful media has useful alt text; temporary placeholder media uses `videoUrl`, not `image`.
- Card grids use 2, 3, or 4 columns and approved `variant`/`density` tokens.
- Feature tabs use stable lowercase `idPrefix` values and approved `layoutPreset` tokens.
- Forms use HubSpot IDs in `formLandingBlock`; do not store custom form field definitions in Sanity.
- People, event metadata, metrics, logos, and proof claims must be supplied by the user or clearly marked as placeholders.
- Text should be concise enough to fit existing responsive components.
