import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../core/content/content.store';
import { SeoService } from '../../core/seo/seo.service';
import { AboutSection } from './sections/about-section/about-section';
import { ContactSection } from './sections/contact-section/contact-section';
import { FeaturedWork } from './sections/featured-work/featured-work';
import { Hero } from './sections/hero/hero';
import { ProjectsSection } from './sections/projects-section/projects-section';
import { StackSection } from './sections/stack-section/stack-section';
import { StatsStrip } from './sections/stats-strip/stats-strip';
import { TechMarquee } from './sections/tech-marquee/tech-marquee';
import { TimelineSection } from './sections/timeline-section/timeline-section';

@Component({
  selector: 'app-home-page',
  imports: [
    Hero,
    TechMarquee,
    StatsStrip,
    FeaturedWork,
    ProjectsSection,
    TimelineSection,
    StackSection,
    AboutSection,
    ContactSection,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-tech-marquee />
    <app-stats-strip />
    @if (store.featuredProjects.length) {
      <app-featured-work />
    }
    @if (store.otherProjects.length) {
      <app-projects-section />
    }
    @if (store.timelineTracks.length) {
      <app-timeline-section />
    }
    @if (store.skillGroups.length) {
      <app-stack-section />
    }
    <app-about-section />
    <app-contact-section />
  `,
})
export class HomePage {
  protected readonly store = inject(ContentStore);

  constructor() {
    const seo = inject(SeoService);
    const s = this.store.settings;
    seo.set({
      title: s.seoTitle,
      description: s.seoDescription,
      path: '/',
      type: 'profile',
      jsonLd: seo.personSchema(),
    });
  }
}
