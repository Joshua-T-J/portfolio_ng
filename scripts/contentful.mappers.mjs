// Maps Contentful Delivery API entries to the portfolio domain model.
// This file is the only place that knows Contentful's shapes (anti-corruption layer).
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

/** Builds a resolver for linked assets/entries from a CDA `includes` block. */
export function createLinkResolver(includes = {}) {
  const assets = new Map((includes.Asset ?? []).map((a) => [a.sys.id, a]));
  const entries = new Map((includes.Entry ?? []).map((e) => [e.sys.id, e]));
  return {
    asset(link) {
      return link?.sys?.id ? assets.get(link.sys.id) : undefined;
    },
    entry(link) {
      return link?.sys?.id ? entries.get(link.sys.id) : undefined;
    },
  };
}

const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''));

const absolute = (u) => (u?.startsWith('//') ? `https:${u}` : u);

export function mapImage(asset, fallbackAlt = '') {
  const file = asset?.fields?.file;
  const dims = file?.details?.image;
  if (!file?.url || !dims) return undefined;
  return {
    url: absolute(file.url),
    width: dims.width,
    height: dims.height,
    alt: asset.fields.description || asset.fields.title || fallbackAlt,
  };
}

export function mapSettings(entry, links, siteUrl) {
  const f = entry.fields;
  const stats = (f.stats ?? [])
    .map((l) => links.entry(l))
    .filter(Boolean)
    .map((s) => ({ value: s.fields.value, label: s.fields.label }));
  const resume = links.asset(f.resumePdf);
  return clean({
    siteUrl,
    name: f.name,
    headline: f.headline,
    rotatingWords: f.rotatingWords ?? [],
    intro: f.intro,
    availabilityText: f.availabilityText,
    location: f.location,
    timezone: f.timezone,
    email: f.email,
    phone: f.phone,
    githubUrl: f.githubUrl,
    linkedinUrl: f.linkedinUrl,
    instagramUrl: f.instagramUrl,
    photographyUrl: f.photographyUrl,
    resumeUrl: absolute(resume?.fields?.file?.url),
    headshot: mapImage(links.asset(f.headshot), `Portrait of ${f.name}`),
    aboutTitle: f.aboutTitle,
    about: f.about,
    learningNote: f.learningNote,
    learningTopics: f.learningTopics ?? [],
    stats,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
    ogImage: mapImage(links.asset(f.ogImage), f.seoTitle),
  });
}

export function mapProject(entry, links) {
  const f = entry.fields;
  return clean({
    slug: f.slug,
    title: f.title,
    category: f.category,
    clientType: f.clientType,
    summary: f.summary,
    highlights: f.highlights ?? [],
    techStack: f.techStack ?? [],
    featured: Boolean(f.featured),
    order: f.order,
    status: f.status,
    liveUrl: f.liveUrl,
    repoUrl: f.repoUrl,
    demoVideoUrl: f.demoVideoUrl,
    coverImage: mapImage(links.asset(f.coverImage), `${f.title} screenshot`),
    bodyHtml: f.body ? documentToHtmlString(f.body) : undefined,
    startDate: f.startDate,
    seoDescription: f.seoDescription,
  });
}

export function mapExperience(entry) {
  const f = entry.fields;
  return clean({
    role: f.role,
    company: f.company,
    companyUrl: f.companyUrl,
    employmentType: f.employmentType,
    startDate: f.startDate,
    endDate: f.endDate,
    location: f.location,
    summary: f.summary,
    highlights: f.highlights ?? [],
    techStack: f.techStack ?? [],
  });
}

export function mapEducation(entry) {
  const f = entry.fields;
  return clean({
    qualification: f.qualification,
    institution: f.institution,
    board: f.board,
    startYear: f.startYear,
    endYear: f.endYear,
    grade: f.grade,
  });
}

export function mapCertification(entry) {
  const f = entry.fields;
  return clean({
    title: f.title,
    issuer: f.issuer,
    issuedOn: f.issuedOn,
    credentialUrl: f.credentialUrl,
  });
}

export function mapSkillGroup(entry) {
  const f = entry.fields;
  return { title: f.title, icon: f.icon, skills: f.skills ?? [], order: f.order };
}
