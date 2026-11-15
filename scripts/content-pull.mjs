#!/usr/bin/env node
// Pulls all portfolio content from Contentful at BUILD time and writes a validated snapshot.
//
//   src/content/content.json   – imported by the Angular app (git-ignored)
//   public/sitemap.xml         – generated from the same data (git-ignored)
//
// Env vars (set them in Vercel → Settings → Environment Variables, or in a local .env):
//   CONTENTFUL_SPACE_ID, CONTENTFUL_DELIVERY_TOKEN   – required to use Contentful
//   CONTENTFUL_ENVIRONMENT                           – default "master"
//   SITE_URL                                         – default https://joshuatj.vercel.app
//   CONTACT_FORM_URL                                 – Google Apps Script endpoint (falls back to NG_APP_GOOGLE_SHEETS_URL)
//
// Without Contentful credentials the committed seed (content/content.seed.json) is used,
// so the site always builds. WITH credentials, any fetch or validation error fails the
// build — Vercel then keeps serving the previous deployment instead of a broken one.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentSchema } from './content.schema.mjs';
import {
  createLinkResolver,
  mapCertification,
  mapEducation,
  mapExperience,
  mapProject,
  mapSettings,
  mapSkillGroup,
} from './contentful.mappers.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_JSON = resolve(root, 'src/content/content.json');
const OUT_SITEMAP = resolve(root, 'public/sitemap.xml');
const SEED = resolve(root, 'content/content.seed.json');

if (existsSync(resolve(root, '.env'))) process.loadEnvFile(resolve(root, '.env'));

const env = process.env;
const SPACE = env.CONTENTFUL_SPACE_ID;
const TOKEN = env.CONTENTFUL_DELIVERY_TOKEN;
const ENVIRONMENT = env.CONTENTFUL_ENVIRONMENT || 'master';
const SITE_URL = (env.SITE_URL || 'https://joshuatj.vercel.app').replace(/\/$/, '');
const CONTACT = env.CONTACT_FORM_URL || env.NG_APP_GOOGLE_SHEETS_URL || undefined;

async function fetchType(contentType) {
  const params = new URLSearchParams({ content_type: contentType, include: '2', limit: '1000' });
  const url = `https://cdn.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}/entries?${params}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) {
    throw new Error(`Contentful ${contentType}: HTTP ${res.status} ${await res.text()}`);
  }
  const body = await res.json();
  return { items: body.items, links: createLinkResolver(body.includes) };
}

async function fromContentful() {
  // 6 requests per build (stat entries arrive as includes of siteSettings).
  const [settings, projects, experience, education, certifications, skills] = await Promise.all(
    ['siteSettings', 'project', 'experience', 'education', 'certification', 'skillGroup'].map(fetchType),
  );
  if (settings.items.length !== 1) {
    throw new Error(`Expected exactly 1 published siteSettings entry, found ${settings.items.length}`);
  }
  const empty = [
    ['project', projects],
    ['skillGroup', skills],
  ].filter(([, r]) => r.items.length === 0);
  if (empty.length) {
    throw new Error(
      `No published ${empty.map(([t]) => `"${t}"`).join(' / ')} entries in environment "${ENVIRONMENT}". ` +
        'Check Contentful → Content (are they Draft?) or re-run: npm run contentful:migrate -- --seed' +
        (ENVIRONMENT === 'master' ? '' : ` --env ${ENVIRONMENT}`),
    );
  }
  return {
    settings: mapSettings(settings.items[0], settings.links, SITE_URL),
    projects: projects.items.map((e) => mapProject(e, projects.links)),
    experience: experience.items.map(mapExperience),
    education: education.items.map(mapEducation),
    certifications: certifications.items.map(mapCertification),
    skillGroups: skills.items.map(mapSkillGroup),
  };
}

function fromSeed() {
  const seed = JSON.parse(readFileSync(SEED, 'utf8'));
  const { config: _ignored, ...rest } = seed;
  return { ...rest, settings: { ...seed.settings, siteUrl: SITE_URL } };
}

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function sitemap(content) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ['/', ...content.projects.map((p) => `/projects/${p.slug}`)];
  const body = urls
    .map((u) => `  <url><loc>${xmlEscape(SITE_URL + u)}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

async function main() {
  const useContentful = Boolean(SPACE && TOKEN);
  if (!useContentful) {
    console.warn(
      '[content] CONTENTFUL_SPACE_ID / CONTENTFUL_DELIVERY_TOKEN not set — using content/content.seed.json',
    );
  }
  const data = useContentful ? await fromContentful() : fromSeed();
  const snapshot = {
    ...data,
    config: {
      ...(CONTACT ? { contactEndpoint: CONTACT } : {}),
      generatedAt: new Date().toISOString(),
      source: useContentful ? 'contentful' : 'seed',
    },
  };

  const result = contentSchema.safeParse(snapshot);
  if (!result.success) {
    console.error('[content] Content failed validation:');
    for (const issue of result.error.issues) {
      console.error(`  • ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  const featured = snapshot.projects.filter((p) => p.featured).length;
  if (featured > 3) {
    console.warn(`[content] ${featured} projects are featured; only the first 3 by "order" are shown as featured.`);
  }

  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(snapshot, null, 2));
  writeFileSync(OUT_SITEMAP, sitemap(snapshot));
  console.log(
    `[content] ${snapshot.config.source}: ${snapshot.projects.length} projects, ` +
      `${snapshot.experience.length} roles → src/content/content.json + public/sitemap.xml`,
  );
}

main().catch((err) => {
  console.error('[content]', err.message);
  process.exit(1);
});
