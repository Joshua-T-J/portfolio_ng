import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ContentSource } from './content-source';
import { ContentStore, MAX_FEATURED } from './content.store';
import { PortfolioContent, Project } from './portfolio.models';

const project = (slug: string, order: number, featured = false, category: Project['category'] = 'Personal'): Project => ({
  slug,
  title: slug,
  category,
  summary: 'A project summary that is long enough for validation.',
  highlights: [],
  techStack: ['Angular'],
  featured,
  order,
  status: 'Live',
});

function storeWith(content: Partial<PortfolioContent>): ContentStore {
  const base: PortfolioContent = {
    settings: { stats: [], learningTopics: [] } as unknown as PortfolioContent['settings'],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    skillGroups: [],
    config: { generatedAt: '', source: 'seed' },
  };
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), { provide: ContentSource, useValue: { content: { ...base, ...content } } }],
  });
  return TestBed.inject(ContentStore);
}

describe('ContentStore', () => {
  it('caps featured projects and moves the overflow into the grid, ordered', () => {
    const store = storeWith({
      projects: [project('d', 4, true), project('a', 1, true), project('c', 3, true), project('b', 2, true), project('e', 5)],
    });
    expect(store.featuredProjects.map((p) => p.slug)).toEqual(['a', 'b', 'c']);
    expect(store.featuredProjects.length).toBe(MAX_FEATURED);
    expect(store.otherProjects.map((p) => p.slug)).toEqual(['d', 'e']);
  });

  it('excludes day-job work from "Now building"', () => {
    const store = storeWith({
      projects: [project('work', 1, true, 'Work'), project('oss', 2, true, 'Open source')],
    });
    expect(store.nowBuilding.map((p) => p.slug)).toEqual(['oss']);
  });

  it('builds separate tracks: newest first, current role flagged, empty tracks dropped', () => {
    const store = storeWith({
      experience: [
        { role: 'Old', company: 'A', startDate: '2019-01-01', endDate: '2021-01-01', summary: 's', highlights: [], techStack: [], employmentType: 'Contract' },
        { role: 'Current', company: 'B', startDate: '2023-01-01', summary: 's', highlights: [], techStack: [] },
      ],
      education: [{ qualification: 'B.Tech', institution: 'X', board: 'U', startYear: 2015, endYear: 2019, grade: 'CGPA 8' }],
      certifications: [],
    });
    expect(store.timelineTracks.map((t) => t.kind)).toEqual(['work', 'education']);
    expect(store.workTimeline.map((t) => t.title)).toEqual(['Current', 'Old']);
    expect(store.workTimeline[0]).toEqual(jasmine.objectContaining({ period: '2023 — Present', current: true }));
    expect(store.workTimeline[1]).toEqual(jasmine.objectContaining({ meta: 'Contract', current: false }));
    expect(store.educationTimeline[0]).toEqual(jasmine.objectContaining({ detail: 'U', badge: 'CGPA 8' }));
    expect(store.timelineTracks[0].countLabel).toMatch(/^2 roles · \d+\+ yrs$/);
    expect(store.timelineTracks[1].countLabel).toBe('1 qualification');
  });

  it('formats certificate dates as month and year', () => {
    const store = storeWith({ certifications: [{ title: 'C', issuer: 'I', issuedOn: '2022-01-27' }] });
    expect(store.certificationTimeline[0].period).toBe('Jan 2022');
    expect(store.timelineTracks[0].countLabel).toBe('1 certificate');
  });

  it('finds neighbours in display order', () => {
    const store = storeWith({ projects: [project('a', 1, true), project('b', 2), project('c', 3)] });
    expect(store.neighbours('b').prev?.slug).toBe('a');
    expect(store.neighbours('b').next?.slug).toBe('c');
    expect(store.neighbours('missing')).toEqual({});
  });
});
