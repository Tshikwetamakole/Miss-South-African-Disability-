# Changelog

All notable changes to this project (front-end polish & accessibility work) will be documented here.

## [Unreleased]
- Planned: Image WebP optimization
- Planned: Sponsor logo enhancements (grayscale hover color reveal)
- Planned: Optional dark mode toggle

## [2025-10-05]
### Added
- Hero section copy updated with refined messaging and accessible CTA buttons.
- Enhanced navigation active/focus states with improved visual feedback.
- Design tokens extended with royal blue and soft gold palette variables.
- Assets documentation file (`assets/README.md`) with TODOs for media.
- Accessible testimonial slider with keyboard controls, pause/resume, and live announcements.
- Dark mode toggle with localStorage persistence and icon switching.
- Floating "Support Us" CTA button linking to contact page.
- Enhanced entrance animations with `prefers-reduced-motion` respect.
- Comprehensive ARIA labeling for event cards with structured descriptions.
- Gallery optimization TODOs for WebP conversion and accessibility improvements.

### Fixed
- CSS brace mismatch causing potential parsing inconsistencies.

### Improved
- Navigation focus/active contrast and touch hit areas.
- CTA grouping semantics with `role="group"` for screen readers.
- Footer social links with proper role attributes and enhanced aria-labels.
- Typography spacing and line-height refinements across all headings and paragraphs.
- Focus styles with enhanced visual feedback using box-shadow.
- Sponsor logo sections with loading="lazy" and descriptive alt attributes.

