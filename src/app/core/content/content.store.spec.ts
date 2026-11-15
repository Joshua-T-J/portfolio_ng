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

  it('orders the timeline: newest job first, then education, then certifications', () => {
    const store = storeWith({
      experience: [
        { role: 'Old', company: 'A', startDate: '2019-01-01', endDate: '2021-01-01', summary: 's', highlights: [], techStack: [] },
        { role: 'Current', company: 'B', startDate: '2023-01-01', summary: 's', highlights: [], techStack: [] },
      ],
      education: [{ qualification: 'B.Tech', institution: 'X', startYear: 2015, endYear: 2019 }],
      certifications: [{ title: 'Cert', issuer: 'Y', issuedOn: '2022-01-27' }],
    });
    expect(store.timeline.map((t) => t.title)).toEqual(['Current', 'Old', 'B.Tech', 'Cert']);
    expect(store.timeline[0].period).toBe('2023 — Present');
  });

  it('finds neighbours in display order', () => {
    const store = storeWith({ projects: [project('a', 1, true), project('b', 2), project('c', 3)] });
    expect(store.neighbours('b').prev?.slug).toBe('a');
    expect(store.neighbours('b').next?.slug).toBe('c');
    expect(store.neighbours('missing')).toEqual({});
  });
});
