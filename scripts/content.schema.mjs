// Validation schema for the generated content snapshot.
// Mirrors the field limits in the Contentful content model (see contentful/migrations).
// If content breaks these rules the build fails, so a bad entry can never ship a broken layout.
import { z } from 'zod';

const url = z.url({ protocol: /^https?$/ });
const shortText = (min, max) => z.string().trim().min(min).max(max);

/** Absolute URL (Contentful) or a root-relative path to a file in /public (seed content). */
const imageUrl = z.union([url, z.string().regex(/^\/[\w\-./]+\.(webp|png|jpe?g|avif)$/)]);

const image = z.object({
  url: imageUrl,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().max(160),
});

const stat = z.object({ value: shortText(1, 10), label: shortText(2, 48) });

const settings = z.object({
  siteUrl: url,
  name: shortText(2, 40),
  headline: shortText(2, 60),
  rotatingWords: z.array(shortText(1, 14)).min(1).max(4),
  intro: shortText(120, 420),
  availabilityText: shortText(1, 90).optional(),
  location: shortText(2, 40),
  timezone: shortText(2, 40),
  email: z.email(),
  phone: z.string().regex(/^\+?[0-9 ]{8,16}$/).optional(),
  githubUrl: url,
  linkedinUrl: url,
  instagramUrl: url.optional(),
  photographyUrl: url.optional(),
  resumeUrl: url,
  headshot: image.optional(),
  aboutTitle: shortText(2, 70),
  about: shortText(60, 600),
  learningNote: shortText(10, 160).optional(),
  learningTopics: z.array(shortText(1, 28)).max(10),
  stats: z.array(stat).min(2).max(4),
  seoTitle: shortText(30, 70),
  seoDescription: shortText(70, 160),
  ogImage: image.optional(),
});

const project = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: shortText(2, 40),
  category: z.enum(['Open source', 'Client', 'Work', 'Personal', 'Learning']),
  clientType: shortText(1, 20).optional(),
  summary: shortText(40, 180),
  highlights: z.array(shortText(4, 160)).max(5),
  techStack: z.array(shortText(1, 20)).min(1).max(8),
  featured: z.boolean(),
  order: z.number().int().min(1).max(999),
  status: z.enum(['Live', 'In progress', 'Archived']),
  liveUrl: url.optional(),
  repoUrl: url.optional(),
  demoVideoUrl: url.optional(),
  coverImage: image.optional(),
  bodyHtml: z.string().optional(),
  startDate: z.string().optional(),
  seoDescription: shortText(70, 160).optional(),
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}/);

const experience = z.object({
  role: shortText(2, 50),
  company: shortText(2, 60),
  companyUrl: url.optional(),
  employmentType: z.enum(['Full-time', 'Contract', 'Internship', 'Freelance']).optional(),
  startDate: isoDate,
  endDate: isoDate.optional(),
  location: shortText(2, 40).optional(),
  summary: shortText(40, 320),
  highlights: z.array(shortText(4, 160)).max(5),
  techStack: z.array(shortText(1, 24)).max(10),
});

const education = z.object({
  qualification: shortText(2, 80),
  institution: shortText(2, 80),
  board: shortText(2, 80).optional(),
  startYear: z.number().int().min(1990).max(2100),
  endYear: z.number().int().min(1990).max(2100),
  grade: shortText(1, 20).optional(),
});

const certification = z.object({
  title: shortText(2, 90),
  issuer: shortText(2, 40),
  issuedOn: isoDate,
  credentialUrl: url.optional(),
});

const skillGroup = z.object({
  title: shortText(2, 30),
  icon: z.enum(['frontend', 'backend', 'tooling', 'cloud', 'design']),
  skills: z.array(shortText(1, 24)).min(2).max(16),
  order: z.number().int().min(1).max(99),
});

export const contentSchema = z
  .object({
    settings,
    projects: z.array(project).min(1),
    experience: z.array(experience),
    education: z.array(education),
    certifications: z.array(certification),
    skillGroups: z.array(skillGroup).min(1),
    config: z.object({
      contactEndpoint: url.optional(),
      generatedAt: z.string(),
      source: z.enum(['contentful', 'seed']),
    }),
  })
  .superRefine((c, ctx) => {
    const slugs = new Set();
    c.projects.forEach((p, i) => {
      if (slugs.has(p.slug)) {
        ctx.addIssue({ code: 'custom', path: ['projects', i, 'slug'], message: `Duplicate slug "${p.slug}"` });
      }
      slugs.add(p.slug);
    });
  });
