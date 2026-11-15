/**
 * Domain models for the portfolio.
 *
 * These are the ONLY shapes the Angular app knows about. Contentful's entry/asset
 * shapes are mapped to these in `scripts/content-pull.mjs`, so a CMS change never
 * leaks into components (anti-corruption layer).
 */

export type ProjectCategory = 'Open source' | 'Client' | 'Work' | 'Personal' | 'Learning';
export type ProjectStatus = 'Live' | 'In progress' | 'Archived';

export interface ImageAsset {
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

export interface Stat {
  readonly value: string;
  readonly label: string;
}

export interface SiteSettings {
  readonly siteUrl: string;
  readonly name: string;
  readonly headline: string;
  readonly rotatingWords: readonly string[];
  readonly intro: string;
  readonly availabilityText?: string;
  readonly location: string;
  readonly timezone: string;
  readonly email: string;
  readonly phone?: string;
  readonly githubUrl: string;
  readonly linkedinUrl: string;
  readonly instagramUrl?: string;
  readonly photographyUrl?: string;
  readonly resumeUrl: string;
  readonly headshot?: ImageAsset;
  readonly aboutTitle: string;
  readonly about: string;
  readonly learningNote?: string;
  readonly learningTopics: readonly string[];
  readonly stats: readonly Stat[];
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly ogImage?: ImageAsset;
}

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly category: ProjectCategory;
  readonly clientType?: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly techStack: readonly string[];
  readonly featured: boolean;
  readonly order: number;
  readonly status: ProjectStatus;
  readonly liveUrl?: string;
  readonly repoUrl?: string;
  readonly demoVideoUrl?: string;
  readonly coverImage?: ImageAsset;
  /** Rich text rendered to HTML at build time. Sanitised again by Angular when bound. */
  readonly bodyHtml?: string;
  readonly startDate?: string;
  readonly seoDescription?: string;
}

export interface Experience {
  readonly role: string;
  readonly company: string;
  readonly companyUrl?: string;
  readonly employmentType?: string;
  /** ISO date, e.g. 2023-01-01 */
  readonly startDate: string;
  /** ISO date; absent = current role */
  readonly endDate?: string;
  readonly location?: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly techStack: readonly string[];
}

export interface Education {
  readonly qualification: string;
  readonly institution: string;
  readonly board?: string;
  readonly startYear: number;
  readonly endYear: number;
  readonly grade?: string;
}

export interface Certification {
  readonly title: string;
  readonly issuer: string;
  readonly issuedOn: string;
  readonly credentialUrl?: string;
}

export type SkillIcon = 'frontend' | 'backend' | 'tooling' | 'cloud' | 'design';

export interface SkillGroup {
  readonly title: string;
  readonly icon: SkillIcon;
  readonly skills: readonly string[];
  readonly order: number;
}

export interface SiteConfig {
  /** Google Apps Script (or any form) endpoint. Absent = the form falls back to e-mail. */
  readonly contactEndpoint?: string;
  readonly generatedAt: string;
  readonly source: 'contentful' | 'seed';
}

export interface PortfolioContent {
  readonly settings: SiteSettings;
  readonly projects: readonly Project[];
  readonly experience: readonly Experience[];
  readonly education: readonly Education[];
  readonly certifications: readonly Certification[];
  readonly skillGroups: readonly SkillGroup[];
  readonly config: SiteConfig;
}

export type TimelineKind = 'work' | 'education' | 'certification';

/** One entry in a timeline track (a job, a qualification or a certificate). */
export interface TimelineItem {
  readonly kind: TimelineKind;
  /** "2023 — Present", "2018 — 2022", "Jan 2022" */
  readonly period: string;
  /** Extra facts shown after the period, e.g. "Full-time · Kerala, India". */
  readonly meta?: string;
  readonly title: string;
  readonly org: string;
  readonly orgUrl?: string;
  /** Secondary line under the organisation, e.g. the university. */
  readonly detail?: string;
  readonly summary?: string;
  readonly highlights: readonly string[];
  readonly techStack: readonly string[];
  /** Highlighted label, e.g. "CGPA 7.65". */
  readonly badge?: string;
  /** Ongoing role (no end date). */
  readonly current: boolean;
}

/** One of the separate Experience timelines (Work / Education / Certifications). */
export interface TimelineTrack {
  readonly kind: TimelineKind;
  readonly title: string;
  /** Short label for the jump links, e.g. "Certs". */
  readonly shortTitle: string;
  readonly countLabel: string;
  readonly items: readonly TimelineItem[];
}
