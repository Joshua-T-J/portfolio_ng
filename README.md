# Portfolio — Joshua T J

Angular 20 portfolio, prerendered to static HTML, content from Contentful (Free plan), deployed on Vercel.

## How it works

```
Contentful ──publish──▶ webhook ──▶ Vercel deploy hook
                                     │
            npm run build            ▼
            ├─ prebuild:  scripts/content-pull.mjs   (≈6 Contentful API calls per build)
            │             → src/content/content.json (validated with zod; build fails on bad content)
            │             → public/sitemap.xml
            ├─ ng build:  outputMode "static" → prerenders /, /projects/<slug>, /404
            └─ postbuild: copies 404/index.html → 404.html
```

Visitors never call Contentful, and no API token ships to the browser.

The app imports content through the `@content` alias (tsconfig `paths`): `src/content/content.json` if it exists,
otherwise the committed seed. So a plain `ng serve` still works; run `npm run content:pull` to see live Contentful data.

## Commands

| Command | What it does |
| --- | --- |
| `npm start` | Pulls content, then runs the dev server on http://localhost:4200 |
| `npm run build` | Pulls content, prerenders every page into `dist/portfolio-ng/browser` |
| `npm test` | Unit tests (Karma, headless Chrome) |
| `npm run content:pull` | Refreshes `src/content/content.json` only |
| `npm run contentful:migrate` | Creates the content model in the `staging` environment |
| `npm run contentful:migrate -- --seed` | …and fills it from `content/content.seed.json` |
| `npm run contentful:migrate -- --env master --seed` | Same, on `master` |

## Environment variables

Put these in `.env` locally and in Vercel → Settings → Environment Variables.

| Variable | Used by | Notes |
| --- | --- | --- |
| `CONTENTFUL_SPACE_ID` | build, migrate | `84j8ulenxt5c` |
| `CONTENTFUL_DELIVERY_TOKEN` | build | Read-only Content Delivery token. Not set → the committed seed content is used |
| `CONTENTFUL_ENVIRONMENT` | build | Optional, default `master` |
| `CONTENTFUL_MANAGEMENT_TOKEN` | migrate | Personal CMA token. **Local only — never in Vercel or Git** |
| `CONTACT_FORM_URL` | build | Google Apps Script endpoint (falls back to `NG_APP_GOOGLE_SHEETS_URL`). Not set → the form becomes an e-mail button |
| `SITE_URL` | build | Optional, default `https://joshuatj.vercel.app` (canonical URLs, sitemap) |

## Code map

```
scripts/                 content pull, schema, Contentful mappers, migration runner, postbuild
contentful/migrations/   one file per content type (with field limits that protect the layout)
content/content.seed.json  fallback content, also used to seed Contentful
src/app/core/            content (models, ContentSource, ContentStore), theme, SEO, contact, image loader
src/app/layout/          site header (theme menu, mobile menu) and footer
src/app/features/        home page sections, project detail page, 404
src/app/shared/ui/       icon, theme menu, section header, tech chips
src/styles/              tokens (light/dark), base, shared components, motion
```

Theme: System (default) / Light / Dark. "System" follows `prefers-color-scheme`; an explicit choice is stored in
`localStorage` and applied by an inline script in `index.html` before first paint.
