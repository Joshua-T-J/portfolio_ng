import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../../../core/content/content.store';
import { Project } from '../../../../core/content/portfolio.models';
import { Icon } from '../../../../shared/ui/icon/icon';
import { SectionHeader } from '../../../../shared/ui/section-header/section-header';
import { TechChips } from '../../../../shared/ui/tech-chips/tech-chips';

/** Sticky stacked case-study cards. Each card's sticky offset grows with its index. */
@Component({
  selector: 'app-featured-work',
  imports: [NgOptimizedImage, RouterLink, Icon, SectionHeader, TechChips],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './featured-work.html',
  styleUrl: './featured-work.scss',
})
export class FeaturedWork {
  protected readonly projects = inject(ContentStore).featuredProjects;
  protected readonly heading =
    this.projects.length === 1
      ? 'One build that shows how I work.'
      : `${['', '', 'Two', 'Three'][this.projects.length] ?? 'A few'} builds that show how I work.`;

  protected stickyTop(index: number): number {
    return 104 + index * 24;
  }

  protected tags(p: Project): string[] {
    return [p.clientType ? `${p.category} · ${p.clientType}` : p.category, p.status];
  }

  /** Layers for the no-image panel: the first three technologies, top to bottom. */
  protected layers(p: Project): readonly string[] {
    return p.techStack.slice(0, 3);
  }
}
