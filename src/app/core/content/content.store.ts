import { Injectable, inject } from '@angular/core';
import { ContentSource } from './content-source';
import { Project, SkillGroup, TimelineItem } from './portfolio.models';

export const MAX_FEATURED = 3;

const byOrder = <T extends { order: number }>(xs: readonly T[]): T[] =>
  [...xs].sort((a, b) => a.order - b.order);

const year = (iso: string): string => iso.slice(0, 4);

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

  readonly timeline: readonly TimelineItem[] = [
    ...[...this.content.experience]
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
      .map<TimelineItem>((e) => ({
        kind: 'work',
        period: `${year(e.startDate)} — ${e.endDate ? year(e.endDate) : 'Present'}`,
        title: e.role,
        org: e.company,
        orgUrl: e.companyUrl,
        summary: e.summary,
        highlights: e.highlights,
      })),
    ...[...this.content.education]
      .sort((a, b) => b.endYear - a.endYear)
      .map<TimelineItem>((e) => ({
        kind: 'education',
        period: `${e.startYear} — ${e.endYear}`,
        title: e.qualification,
        org: [e.institution, e.board].filter(Boolean).join(' · '),
        summary: e.grade ?? '',
        highlights: [],
      })),
    ...[...this.content.certifications]
      .sort((a, b) => b.issuedOn.localeCompare(a.issuedOn))
      .map<TimelineItem>((c) => ({
        kind: 'certification',
        period: year(c.issuedOn),
        title: c.title,
        org: c.issuer,
        orgUrl: c.credentialUrl,
        summary: 'Certification',
        highlights: [],
      })),
  ];

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
