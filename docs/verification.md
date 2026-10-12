# Verification

## Runnable application — October 13, 2026

The project-local PHP 8.6.0 RC3 runtime now executes successfully. The earlier
runtime-blocked notes below are historical and no longer describe this machine.

- Production build passed, including Bun type checking, Svelte diagnostics (zero
  errors/warnings), and Oxc parsing.
- Oxlint, Oxfmt, SQLite schema checks, and PHP booking integration checks passed.
  Integration checks use a temporary database and verify persistence, validation,
  CSRF protection, private paths, and the request quota.
- Production smoke checks passed for all page routes, the About redirect, all 24
  WebP images, built JavaScript/CSS, favicon, missing routes, and private paths.
- Fixed PHP's production image-route allowlist, consistent custom API ports,
  development-server exit status, and the missing-build startup message.
- The initial sandboxed build could not read GSAP's package metadata; running
  the build with access to installed dependencies passed without changing types.
- No new visual browser check was performed: no browser session was available.

## Earlier verification

Checked October 12, 2026.

Passed:

- Bun's built-in TypeScript check and Svelte template diagnostics: zero errors/warnings.
- Production build with Vite 8: separate CSS asset, approximately 90.5 KB (15.1 KB gzip), and JavaScript approximately 158.5 KB (58.3 KB gzip).
- Oxc parser over source TypeScript and Svelte script blocks; Oxlint and Oxfmt checks.
- SQLite schema execution, idempotent seed, foreign-key/duration constraints, default pending booking status. These checks used Bun's SQLite 3.53.4, not the blocked PHP driver.
- Computed color-role contrast in light/dark: all 14 checked text/status/control/focus pairs passed. Minimum control ratio 3.81:1 light, 5.63:1 dark; text threshold independently checked at 4.5:1.
- Browser rendering at measured desktop width 1800px and mobile widths 390px and 320px; no horizontal overflow. Barlow and Barlow Condensed were visibly rendered, with computed font families checked.
- Filters return the expected sport objects, selecting a sport updates the form, two-hour estimates double the rates, gallery controls replace the photo, mobile menu closes on navigation and Escape returns focus to its toggle.
- Unavailable booking API produces an error, never a success receipt. The read-only SQL preview rejects all submission endpoints.

Not verified:

- PHP lint and API persistence integration. The official, checksum-verified PHP 8.6.0 RC3 runtime is blocked by Windows application control (system integrity error 0xc0e90002). Escalated execution also failed. The security policy was not changed. `bun run test:api` contains the checks to run with an allowed PHP runtime.
- Screen-reader behavior, a complete keyboard traversal, automated axe/Lighthouse scan, actual 200% browser zoom, light-mode screenshots, and live reduced-motion preference toggling. Reflow, labels, focus styles, dark-mode rendering, and reduced-motion cleanup are implemented; unperformed checks are not claimed as passing.

Design self-audit: 3 points (0 P0, 1 P1, 1 P2). The P1 is the short repeated sports-slogan cadence; the P2 is representative stock photography because no verified facility photos were supplied. The court geometry and jersey-like type distinguish the sports context. No boxed feature grid, nested panels, gradient headlines, or blanket scroll reveals. The narrow rendered interface contained approximately 375 words including options and venue facts. Separator/delete passes removed decorative section lines and unnecessary explanation; form boundaries remain for usability. References were inspected as markup/copy, not visually rendered.

The open preview uses a read-only in-memory SQLite catalogue populated from the backend SQL. It demonstrates frontend behavior only and does not establish that PHP booking persistence works on this machine.

## Page split — October 12, 2026

- Moved Court, About, Gallery, and Booking into `src/frontend/pages`, with real URLs and normal browser navigation.
- Home now contains the hero and four sport names. Removed the hero eyebrow, redundant Court link, decorative caption, and court-diagram caption.
- Moved address, hours, and contacts into the shared compact footer. Header labels: Court, About, Gallery, Book.
- PHP's static route whitelist serves the built frontend for all known page paths; unknown paths remain 404.
- Browser verified navigation, Back, reload, Gallery switching, mobile menu, and Badminton preselection. Home has no horizontal overflow at 320px and 1440px; booking has none at 390px.
- PHP runtime execution is still blocked by this machine's existing application control, so production route execution and booking submission cannot be verified here. UI checks use the documented read-only SQL catalogue preview.

## Animated home and merged About

Verified desktop Lenis anchor scrolling, GSAP parallax transforms, active sport tracking, and progress bar movement in the browser. Verified `/about` redirects to `/#about` and remains correctly positioned after the asynchronous SQL catalogue loads. At 320px, the index becomes static, image animation styles are removed, and there is no horizontal overflow. A showcase booking link correctly selects Pickleball on the Booking page. Reduced-motion media queries disable Lenis, GSAP animation, and the progress indicator. The existing blocked PHP runtime still prevents production redirect and booking API execution on this machine.
