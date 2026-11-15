import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ContentStore } from '../../../../core/content/content.store';
import { SectionHeader } from '../../../../shared/ui/section-header/section-header';
import { ProjectCard } from '../project-card/project-card';

/** How many cards show before "Show all" — keeps the page a sensible length as projects grow. */
export const INITIAL_PROJECTS = 6;

@Component({
  selector: 'app-projects-section',
  imports: [SectionHeader, ProjectCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.scss',
})
export class ProjectsSection {
  private readonly store = inject(ContentStore);
  protected readonly settings = this.store.settings;
  protected readonly all = this.store.otherProjects;
  protected readonly expanded = signal(false);
  protected readonly visible = computed(() =>
    this.expanded() ? this.all : this.all.slice(0, INITIAL_PROJECTS),
  );
  protected readonly hasMore = this.all.length > INITIAL_PROJECTS;
}
