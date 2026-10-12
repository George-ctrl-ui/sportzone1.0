# Sports Zone

A Svelte 5 + TypeScript frontend, separate Bootstrap 6/Sass styles, GSAP/Lenis motion, and a PHP API backed by SQLite. Bun runs development and build tooling; PHP owns the production API and serves the built application.

## Run

Requirements: **Bun 1.4.3+** and **PHP with PDO SQLite enabled**. PHP 8.6.0 RC3 is the latest prerelease checked on October 12, 2026. PHP 8.5+ also supports this application. Do not use PHP’s development server as a public production server.

```sh
bun install --frozen-lockfile
bun run dev
```

Open http://127.0.0.1:3000. The Bun supervisor runs Vite on port 3000 and PHP on port 8000; Vite proxies `/api` to PHP. Copy `.env.example` to `.env` to set a custom `PHP_BINARY` or `DATABASE_PATH`. Environment variables are forwarded to PHP by the Bun supervisor. A project-local `.tools/php/php.exe` with `.tools/php/php.ini` is detected automatically.

The project-local PHP runtime on this machine runs successfully, including SQLite booking persistence (verified October 13, 2026). The `.tools` directory is not committed: on another machine, install PHP with PDO SQLite enabled and place it on `PATH`, or set `PHP_BINARY` in `.env`. No API key is required. The SQLite database and session directory are created automatically on first use.

For **read-only visual preview** without PHP, run these in separate terminals:

```sh
bun run preview:catalog
bun run dev:frontend
```

The preview catalogue reads the exact SQL schema and seed into an in-memory SQLite database. It never accepts bookings and is not a replacement backend. Stop it before starting the PHP API (both use port 8000).

## Structure

```text
src/
  frontend/
    App.svelte
    main.ts
    pages/                # Home, Court, Gallery, Booking, not-found views
    components/           # Shared header, hero, sports showcase, About, footer, icons
    lib/                  # Typed API client, catalogue state, motion, utilities
    styles/               # All styling; no component style blocks or Tailwind
  backend/
    app/                  # Database connection, booking validation, session setup
    database/
      schema.sql          # STRICT tables, foreign keys, constraints, indexes
      seed.sql            # Initial courts and rates from the original site
    public/               # PHP front controller, development router, Apache rewrite
    storage/              # Private runtime SQLite database and sessions (ignored)
public/                   # Frontend static assets
scripts/                  # Bun orchestration, Oxc syntax checks, integration checks
docs/                     # Design and verification notes
archive/original/         # Preserved original page and unused React scaffold
```

SQLite is the source of truth for sport descriptions, rates, and booking requests. On first connection PHP initializes `schema.sql` and `seed.sql`; the seed uses `INSERT OR IGNORE` so edited records are retained. Later changes to live rates should be made with SQL against `sports`; editing the seed only affects new databases. Version future schema changes as migrations before changing a deployed database. SQLite’s library version is supplied by the PHP driver; `/api/health` reports the actual PHP and SQLite versions. The latest upstream SQLite release checked was 3.54.0. No SQLite runtime version is silently claimed or pinned through npm.

## API

| Method | Route           | Purpose                                      |
| ------ | --------------- | -------------------------------------------- |
| GET    | `/api/health`   | Runtime/database availability                |
| GET    | `/api/sports`   | Public court catalogue from SQLite           |
| GET    | `/api/session`  | Same-origin session and CSRF token           |
| POST   | `/api/bookings` | Save a validated request with pending status |

Booking JSON is transport only, not file-based storage. Fields: `name`, `phone`, optional `email`, `sport` (database ID), `date` (`YYYY-MM-DD`), `time` (30-minute intervals), `duration` (integer 1–4), optional `message`, and empty `website` honeypot. Send the session cookie and `X-CSRF-Token`. PHP validates dates, Philippine mobile numbers, sports, duration, and Manila opening hours. Prepared statements store requests transactionally; a SQLite-backed session limit permits five requests per hour. This basic session limit is not a substitute for server-level abuse protection.

Requests require staff confirmation; they do not guarantee availability or charge a payment. The site does not send staff email or SMS. There is no public endpoint listing personal booking details. Staff can review the private database with SQLite tooling; an authenticated staff interface is outside this migration’s scope.

## Checks

### Image assets

The site serves local responsive WebP files from `public/images` at 640, 1200,
and 1600 pixels. The gallery has its own photographs, and About uses a separate
court image. Source URLs and credits are in `assets/image-sources.json`.
Stock images are representative, not photographs of this facility.

```sh
python -m pip install Pillow
python scripts/convert-images.py --download
# Convert your own JPG/PNG/WebP files without downloading anything:
python scripts/convert-images.py --input assets/images --output public/images
```

Original downloads are cached in `assets/images` (ignored); generated WebP files
are shipped with the site. The converter preserves originals, corrects EXIF
orientation, strips metadata, and uses WebP quality 78. Normal builds need no
Python installation or network download. Add photo names to
`src/frontend/lib/images.ts` when expanding the gallery.

Home motion uses one GSAP-driven Lenis loop on desktop with a fine pointer.
Touch devices use native scrolling; large sticky animation is desktop-only.
Images reserve their layout space, so decoding them does not repeatedly refresh
all scroll triggers.

```sh
bun check                # Bun TypeScript checker, then Svelte component diagnostics
bun run lint             # Oxlint (including Svelte script blocks)
bun run parse            # Oxc parser for JS/TS and embedded Svelte scripts
bun run format           # Oxfmt; Svelte, Sass, TS, HTML, Markdown, config files
bun run format:check
bun run test:schema      # Real SQLite schema, seed, constraints
bun run db:init          # Provision the private SQLite file without starting PHP
bun run test:api         # PHP integration and database persistence (requires PHP)
bun run build
bun run test:production  # Built pages, images, JS/CSS, redirects, private paths
```

`bun check` uses Bun’s built-in TypeScript 7 checker. Svelte additionally needs template/rune diagnostics: `svelte-check --tsgo` uses the latest TypeScript 7 development release, installed as `@typescript/native`. Its bridge currently requires TypeScript 6.0.3 as a compatibility dependency; that package does not replace Bun’s checker. Oxlint/Oxc handle JavaScript and TypeScript; Svelte’s compiler handles markup and PHP’s runtime handles PHP. Oxfmt does not format PHP or SQL.

Exact verified dependency versions are in `package.json` and `bun.lock`. The registry snapshot is in `dependency-releases.json`. Bootstrap 6.0.0-alpha.1, Lenis 2.0.0-dev.5, and TypeScript 7.1.0-dev.20261011.1 are intentionally prereleases. Vite 8 uses Oxc/Rolldown for its JS pipeline. Only the required Bootstrap Sass modules are compiled into a separate CSS build asset.

## Production

```sh
bun run build
# Local smoke preview of the built app, through PHP:
bun start
```

Open http://127.0.0.1:8000 for the built app and booking API. `bun start` reports a missing build before starting. Set `API_PORT` in `.env` to change the PHP port; development and preview proxies use the same value. `bun run dev` keeps the frontend at http://127.0.0.1:3000 and reports an error if that port is occupied.

For real hosting, use Apache or nginx with PHP-FPM. Set the document root to **`src/backend/public`**, route requests to `index.php`, and keep `dist` readable by PHP. Never make the repository root or backend storage publicly accessible. Apache rewrite rules are included. Set `DATABASE_PATH` to a private persistent directory and grant the PHP process write access to it and session storage. Set `COOKIE_SECURE=1` on HTTPS hosting, and preserve database/session storage across deployments. Back up SQLite with its backup API or `.backup`, rather than copying a live WAL database file alone.

Existing location, contact details, amenities, and rates were retained from the original source; confirm them with the facility before publishing. Unsplash photographs are representative sports imagery, not verified facility photos. Google Fonts supply Barlow and Barlow Condensed with local font fallbacks. Reduced motion and automatic light/dark themes are supported.

Sources: [Bootstrap 6](https://getbootstrap.com/), [Bun type checking](https://bun.com/docs/runtime/check), [Oxc](https://oxc.rs/), [PHP prereleases](https://www.php.net/pre-release-builds.php), [SQLite releases](https://sqlite.org/changes.html).

## Pages

`/` introduces court rentals, then About and amenities, then a yellow scrolling sport-category showcase. Categories are grouped from the catalogue, so future sports and categories appear automatically. `/court` contains the catalogue and rates; `/gallery` contains photos; `/booking` contains the request form. Navigation uses normal links, so direct URLs, reloads, and browser history work. Court links preselect the booking sport with `?sport=...`. PHP serves the built entry document for each known page route. Address, opening hours, and contact links live in the shared footer. `/about` redirects to `/#about`. Home uses Lenis with GSAP ScrollTrigger for image parallax, active category navigation, and scroll progress; mobile and reduced-motion views use the static layout.
