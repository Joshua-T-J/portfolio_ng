import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../../core/content/portfolio.models';

@Component({
  selector: 'app-project-card',
  imports: [NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly project = input.required<Project>();

  protected readonly badge = computed(() => {
    const p = this.project();
    return p.clientType ? `${p.category} · ${p.clientType}` : p.category;
  });
  protected readonly isClient = computed(() => this.project().category === 'Client');
  protected readonly meta = computed(() => this.project().techStack.slice(0, 2).join(' · '));
}
