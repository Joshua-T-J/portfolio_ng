#!/usr/bin/env node
// Creates the new content model in Contentful and (optionally) fills it from content/content.seed.json.
//
//   npm run contentful:migrate                     → content types only, in the "staging" environment
//   npm run contentful:migrate -- --seed           → content types + entries from the seed file
//   npm run contentful:migrate -- --env master --seed
//
// Needs (in .env or the shell, NEVER committed):
//   CONTENTFUL_SPACE_ID
//   CONTENTFUL_MANAGEMENT_TOKEN   (Contentful → Settings → CMA tokens → Generate personal token)
//
// Safe to re-run: existing content types are skipped and entries are upserted by a fixed id.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import migrationLib from 'contentful-migration';

const { runMigration } = migrationLib;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (existsSync(resolve(root, '.env'))) process.loadEnvFile(resolve(root, '.env'));

const args = process.argv.slice(2);
const argValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV = argValue('--env') ?? 'staging';
const SEED = args.includes('--seed');
const LOCALE = 'en-US';

if (!SPACE || !TOKEN) {
  console.error('Set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN first.');
  process.exit(1);
}

const api = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Thin CMA client. Free plan allows ~7 requests/second, so every call waits 200 ms. */
async function cma(method, path, { body, headers = {} } = {}) {
  for (let attemptNo = 1; ; attemptNo++) {
    await sleep(200);
    const res = await fetch(api + path, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    // Rate limited: wait as long as Contentful asks, then retry (up to 5 times).
    if (res.status === 429 && attemptNo < 5) {
      const wait = Number(res.headers.get('X-Contentful-RateLimit-Reset') ?? 1) * 1000;
      await sleep(Math.max(wait, 1000));
      continue;
    }
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`${method} ${path}: HTTP ${res.status} ${describeError(await res.text())}`);
    // Some endpoints (e.g. asset processing) answer 204 / an empty body.
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  }
}

/** Turns a CMA error body into a readable line, e.g. "ValidationFailed: summary — size (max 180)". */
function describeError(body) {
  try {
    const e = JSON.parse(body);
    const details = (e.details?.errors ?? [])
      .map((d) => `${(d.path ?? []).filter((x) => typeof x === 'string' && x !== 'fields').join('.') || d.name}: ${d.details ?? d.name}${d.value !== undefined ? ` (value: ${JSON.stringify(d.value).slice(0, 80)})` : ''}`)
      .join('; ');
    return `${e.sys?.id ?? ''} ${e.message ?? ''}${details ? ` — ${details}` : ''}`.trim();
  } catch {
    return body.slice(0, 400);
  }
}

async function migrate() {
  const dir = resolve(root, 'contentful/migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.mjs')).sort();
  for (const file of files) {
    const mod = await import(pathToFileURL(resolve(dir, file)).href);
    // Each file creates exactly one content type (see CONTENT_TYPE_BY_FILE); skip it if it exists.
    const id = CONTENT_TYPE_BY_FILE[file];
    if (id && (await cma('GET', `/content_types/${id}`))) {
      console.log(`↷ ${file}: content type "${id}" already exists, skipped`);
      continue;
    }
    console.log(`→ ${file}`);
    await runMigration({
      migrationFunction: mod.default,
      spaceId: SPACE,
      environmentId: ENV,
      accessToken: TOKEN,
      yes: true,
    });
  }
}

const CONTENT_TYPE_BY_FILE = {
  '01-stat.mjs': 'stat',
  '02-site-settings.mjs': 'siteSettings',
  '03-project.mjs': 'project',
  '04-experience.mjs': 'experience',
  '05-education.mjs': 'education',
  '06-certification.mjs': 'certification',
  '07-skill-group.mjs': 'skillGroup',
};

// ---------- seeding ----------
const localize = (fields) =>
  Object.fromEntries(
    Object.entries(fields)
      .filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0))
      .map(([k, v]) => [k, { [LOCALE]: v }]),
  );
const entryLink = (id) => ({ sys: { type: 'Link', linkType: 'Entry', id } });
/** Seed images point at existing assets in this space: …ctfassets.net/<space>/<assetId>/… */
const assetLink = (url) => {
  const id = url ? new URL(url).pathname.split('/')[2] : undefined;
  return id ? { sys: { type: 'Link', linkType: 'Asset', id } } : undefined;
};

/**
 * Uploads a local image from /public (e.g. "/images/projects/gistvault.webp") as a published
 * Contentful asset with a fixed id, and returns a link to it. Skips the upload if it already exists.
 */
async function uploadLocalAsset(publicPath, id, title, description) {
  const existing = await cma('GET', `/assets/${id}`);
  if (existing?.sys?.publishedVersion) return { sys: { type: 'Link', linkType: 'Asset', id } };

  await sleep(200);
  const bytes = readFileSync(resolve(root, 'public' + publicPath));
  const up = await fetch(`https://upload.contentful.com/spaces/${SPACE}/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/octet-stream' },
    body: bytes,
  });
  if (!up.ok) throw new Error(`Upload ${publicPath}: HTTP ${up.status} ${await up.text()}`);
  const upload = await up.json();

  const ext = publicPath.split('.').pop();
  let asset = await cma('PUT', `/assets/${id}`, {
    headers: existing ? { 'X-Contentful-Version': String(existing.sys.version) } : {},
    body: {
      fields: {
        title: { [LOCALE]: title },
        description: { [LOCALE]: description },
        file: {
          [LOCALE]: {
            contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
            fileName: publicPath.split('/').pop(),
            uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } },
          },
        },
      },
    },
  });
  await cma('PUT', `/assets/${id}/files/${LOCALE}/process`, {
    headers: { 'X-Contentful-Version': String(asset.sys.version) },
  });
  for (let i = 0; i < 20; i++) {
    await sleep(800);
    asset = await cma('GET', `/assets/${id}`);
    if (asset.fields.file?.[LOCALE]?.url) break;
  }
  await cma('PUT', `/assets/${id}/published`, { headers: { 'X-Contentful-Version': String(asset.sys.version) } });
  console.log(`  ✓ asset ${id} (${publicPath})`);
  return { sys: { type: 'Link', linkType: 'Asset', id } };
}

/** Existing Contentful asset (absolute URL) → link; local file (root-relative path) → upload first. */
async function imageLink(image, id) {
  if (!image?.url) return undefined;
  if (image.url.startsWith('/')) return uploadLocalAsset(image.url, id, image.alt, image.alt);
  return assetLink(image.url);
}

async function upsert(contentType, id, fields) {
  const existing = await cma('GET', `/entries/${id}`);
  const saved = await cma('PUT', `/entries/${id}`, {
    body: { fields: localize(fields) },
    headers: {
      'X-Contentful-Content-Type': contentType,
      ...(existing ? { 'X-Contentful-Version': String(existing.sys.version) } : {}),
    },
  });
  try {
    await cma('PUT', `/entries/${id}/published`, {
      headers: { 'X-Contentful-Version': String(saved.sys.version) },
    });
  } catch (err) {
    throw new Error(`saved as draft but NOT published — ${err.message}`);
  }
  console.log(`  ✓ ${contentType} ${id}`);
}

const failures = [];

/** Runs one seeding step; a failure is recorded and seeding continues with the next entry. */
async function attempt(label, fn) {
  try {
    return await fn();
  } catch (err) {
    failures.push(`${label}: ${err.message}`);
    console.error(`  ✖ ${label}: ${err.message}`);
    return undefined;
  }
}

async function seed() {
  const c = JSON.parse(readFileSync(resolve(root, 'content/content.seed.json'), 'utf8'));
  const s = c.settings;

  const statIds = [];
  for (const [i, stat] of s.stats.entries()) {
    const id = `stat-${i + 1}`;
    await attempt(`stat ${id}`, () => upsert('stat', id, stat));
    statIds.push(id);
  }

  const resumePdf = assetLink(s.resumeUrl);
  await attempt('siteSettings', () =>
    upsert('siteSettings', 'site-settings', {
      ...s,
      siteUrl: undefined,
      resumeUrl: undefined,
      headshot: undefined,
      ogImage: undefined,
      resumePdf,
      stats: statIds.map(entryLink),
    }),
  );

  for (const p of c.projects) {
    await attempt(`project ${p.slug}`, async () => {
      const cover = await attempt(`cover image for ${p.slug} (project saved without it)`, () =>
        imageLink(p.coverImage, `cover-${p.slug}`),
      );
      return upsert('project', `project-${p.slug}`, { ...p, bodyHtml: undefined, coverImage: cover });
    });
  }
  for (const [i, e] of c.experience.entries()) {
    await attempt(`experience ${i + 1}`, () => upsert('experience', `experience-${i + 1}`, e));
  }
  for (const [i, e] of c.education.entries()) {
    await attempt(`education ${i + 1}`, () => upsert('education', `education-${i + 1}`, e));
  }
  for (const [i, e] of c.certifications.entries()) {
    await attempt(`certification ${i + 1}`, () => upsert('certification', `certification-${i + 1}`, e));
  }
  for (const g of c.skillGroups) {
    await attempt(`skillGroup ${g.title}`, () => upsert('skillGroup', `skill-group-${g.order}`, g));
  }

  if (failures.length) {
    throw new Error(`Seeding finished with ${failures.length} error(s):\n  - ${failures.join('\n  - ')}`);
  }
}

/** Fails early with a specific message instead of the migration library's generic "space does not exist". */
async function preflight() {
  const res = await fetch(`https://api.contentful.com/spaces/${SPACE}/environments`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (res.status === 401) {
    throw new Error(
      'CONTENTFUL_MANAGEMENT_TOKEN was rejected (401). Use a personal access token from Settings → CMA tokens ' +
        '(it starts with "CFPAT-"), not the Content Delivery token.',
    );
  }
  if (res.status === 404) {
    throw new Error(`Space "${SPACE}" was not found for this token. Check CONTENTFUL_SPACE_ID and that the token's user is a member of the space.`);
  }
  if (!res.ok) throw new Error(`Could not list environments: HTTP ${res.status} ${await res.text()}`);

  const ids = (await res.json()).items.map((e) => e.sys.id);
  if (!ids.includes(ENV)) {
    throw new Error(
      `Environment "${ENV}" does not exist in space ${SPACE} (found: ${ids.join(', ')}).\n` +
        `  Create it in Contentful → Settings → Environments → Add environment (ID "${ENV}", clone from master),\n` +
        `  or run against an existing one: npm run contentful:migrate -- --env master --seed`,
    );
  }
}

(async () => {
  console.log(`Space ${SPACE}, environment "${ENV}"`);
  await preflight();
  await migrate();
  if (SEED) {
    console.log('Seeding entries from content/content.seed.json');
    await seed();
  }
  console.log('Done.');
})().catch((err) => {
  // runMigration prints its own "Migration unsuccessful" banner; don't repeat it.
  if (!/Migration unsuccessful|space does not exist/i.test(err.message)) console.error(`✖ ${err.message}`);
  process.exit(1);
});
