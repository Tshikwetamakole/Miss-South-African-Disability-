# Assets Documentation

This file lists required and optional media assets for the Miss South Africa Disability website. Add assets following the suggested filenames and update this document when fulfilled.

## Pending / TODO Assets

1. Hero Background Video (Optional Enhancement)
   - Suggested Path: `assets/hero/hero-loop.webm`
   - Fallback Image (High quality, optimized): `assets/hero/hero-fallback.webp`
   - Purpose: Rich motion background for hero; must be lightweight (<1.5MB) and silent.

2. Partner / Sponsor Logo Set
   - Directory: `assets/logos/partners/`
   - Filenames (examples):
     - `partner-accessibility-sa.svg`
     - `partner-women-empowerment-fund.svg`
   - Provide SVG where possible; include descriptive alt text in code.

3. Optimized Gallery Images
   - Convert existing JPEG/PNG to WebP.
   - Place variants in `assets/images/webp/` (same basename):
     - Example: `Miss2.webp`, `hero.webp`, `hero-background.webp`
   - Keep original images for fallback if needed.

## Optimization Guidelines
- Prefer SVG for logos and UI elements.
- Compress photographs using WebP (quality ~75–80).
- Provide width/height attributes in `<img>` tags to reduce CLS.
- Use `loading="lazy"` for below-the-fold imagery.

## Accessibility Guidelines
- All decorative images: add empty alt attribute `alt=""`.
- Informational and meaningful images: concise descriptive alt.
- Avoid repeating adjacent caption text in alt.

## Third-Party Libraries
Currently no additional third-party JS libraries added for gallery/lightbox (implemented in vanilla JS). If a lightweight carousel or AOS library is introduced, document it here:

| Library | Purpose | Version | License | Notes |
|---------|---------|---------|---------|-------|
| (placeholder) |  |  |  |  |

## Change Log (Assets)
- 2025-10-05: Created initial assets inventory and TODOs.

