import { Injectable, inject } from '@angular/core';
import { ContentSource } from './content-source';
import { Project, SkillGroup, TimelineItem, TimelineTrack } from './portfolio.models';

export const MAX_FEATURED = 3;

const byOrder = <T extends { order: number }>(xs: readonly T[]): T[] =>
  [...xs].sort((a, b) => a.order - b.order);

const year = (iso: string): string => iso.slice(0, 4);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "2022-01-27" → "Jan 2022". Formatted by hand so server and browser output always match. */
const monthYear = (iso: string): string => `${MONTHS[Number(iso.slice(5, 7)) - 1] ?? ''} ${year(iso)}`.trim();

const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;

/** Whole years between the earliest start date and today, e.g. "3+ yrs". */
function yearsSince(isoStart: string, today = new Date()): number {
  const start = new Date(`${isoStart.slice(0, 10)}T00:00:00Z`);
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / (365.25 * 24 * 3600 * 1000)));
}

/**
 * Selection and ordering rules for the UI live here, not in templates, so adding
 * content in the CMS can never change layout rules by accident (Single Responsibility).
 * Content is immutable for the lifetime of a build, so plain readonly fields suffice.
 */
@Injectable({ providedIn: 'root' })
export class ContentStore {
  private readonly content = inject(ContentSource).content;

  readonly settings = this.content.settings;
  readonly config = this.content.config;

  readonly featuredProjects: readonly Project[] = byOrder(
    this.content.projects.filter((p) => p.featured),
  ).slice(0, MAX_FEATURED);

  /** Everything not shown as featured, including featured overflow. */
  readonly otherProjects: readonly Project[] = byOrder(
    this.content.projects.filter((p) => !this.featuredProjects.includes(p)),
  );

  readonly allProjects: readonly Project[] = [...this.featuredProjects, ...this.otherProjects];

  /** Hero "Now building": featured side projects (not day-job work). */
  readonly nowBuilding: readonly Project[] = this.featuredProjects
    .filter((p) => p.category !== 'Work')
    .slice(0, 2);

  readonly skillGroups: readonly SkillGroup[] = byOrder(this.content.skillGroups);

  /** De-duplicated skills for the marquee, in skill-group order. */
  readonly marqueeSkills: readonly string[] = [
    ...new Set(this.skillGroups.flatMap((g) => g.skills)),
  ].slice(0, 16);

  readonly workTimeline: readonly TimelineItem[] = [...this.content.experience]
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map((e): TimelineItem => ({
      kind: 'work',
      period: `${year(e.startDate)} — ${e.endDate ? year(e.endDate) : 'Present'}`,
      meta: [e.employmentType, e.location].filter(Boolean).join(' · ') || undefined,
      title: e.role,
      org: e.company,
      orgUrl: e.companyUrl,
      summary: e.summary,
      highlights: e.highlights,
      techStack: e.techStack,
      current: !e.endDate,
    }));

  readonly educationTimeline: readonly TimelineItem[] = [...this.content.education]
    .sort((a, b) => b.endYear - a.endYear)
    .map((e): TimelineItem => ({
      kind: 'education',
      period: `${e.startYear} — ${e.endYear}`,
      title: e.qualification,
      org: e.institution,
      detail: e.board,
      badge: e.grade,
      highlights: [],
      techStack: [],
      current: false,
    }));

  readonly certificationTimeline: readonly TimelineItem[] = [...this.content.certifications]
    .sort((a, b) => b.issuedOn.localeCompare(a.issuedOn))
    .map((c): TimelineItem => ({
      kind: 'certification',
      period: monthYear(c.issuedOn),
      title: c.title,
      org: c.issuer,
      orgUrl: c.credentialUrl,
      highlights: [],
      techStack: [],
      current: false,
    }));

  /** Non-empty tracks only, in display order. An empty track never renders. */
  readonly timelineTracks: readonly TimelineTrack[] = (
    [
      {
        kind: 'work',
        title: 'Work',
        shortTitle: 'Work',
        countLabel: this.workCountLabel(),
        items: this.workTimeline,
      },
      {
        kind: 'education',
        title: 'Education',
        shortTitle: 'Education',
        countLabel: plural(this.educationTimeline.length, 'qualification'),
        items: this.educationTimeline,
      },
      {
        kind: 'certification',
        title: 'Certifications',
        shortTitle: 'Certs',
        countLabel: plural(this.certificationTimeline.length, 'certificate'),
        items: this.certificationTimeline,
      },
    ] satisfies TimelineTrack[]
  ).filter((t) => t.items.length > 0);

  private workCountLabel(): string {
    const roles = plural(this.content.experience.length, 'role');
    const earliest = [...this.content.experience].map((e) => e.startDate).sort()[0];
    const years = earliest ? yearsSince(earliest) : 0;
    return years > 0 ? `${roles} · ${years}+ yrs` : roles;
  }

  projectBySlug(slug: string): Project | undefined {
    return this.content.projects.find((p) => p.slug === slug);
  }

  /** Previous / next project for the detail page, in display order. */
  neighbours(slug: string): { prev?: Project; next?: Project } {
    const i = this.allProjects.findIndex((p) => p.slug === slug);
    if (i < 0) return {};
    return { prev: this.allProjects[i - 1], next: this.allProjects[i + 1] };
  }
}
