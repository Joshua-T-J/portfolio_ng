import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../core/content/content.store';
import { SeoService } from '../../core/seo/seo.service';
import { Icon } from '../../shared/ui/icon/icon';
import { TechChips } from '../../shared/ui/tech-chips/tech-chips';
import { NotFoundPage } from '../not-found/not-found.page';

/** /projects/:slug — one prerendered page per project. `slug` is bound from the route. */
@Component({
  selector: 'app-project-detail-page',
  imports: [NgOptimizedImage, RouterLink, Icon, TechChips, NotFoundPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-detail.page.html',
  styleUrl: './project-detail.page.scss',
})
export class ProjectDetailPage {
  readonly slug = input.required<string>();

  private readonly store = inject(ContentStore);
  private readonly seo = inject(SeoService);

  protected readonly project = computed(() => this.store.projectBySlug(this.slug()));
  protected readonly neighbours = computed(() => this.store.neighbours(this.slug()));
  protected readonly owner = this.store.settings.name;

  constructor() {
    effect(() => {
      const p = this.project();
      if (!p) return;
      this.seo.set({
        title: `${p.title} — ${this.owner}`,
        description: p.seoDescription ?? p.summary,
        path: `/projects/${p.slug}`,
        image: p.coverImage?.url,
        type: 'article',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': p.repoUrl ? 'SoftwareSourceCode' : 'CreativeWork',
          name: p.title,
          description: p.summary,
          author: { '@type': 'Person', name: this.owner, url: this.store.settings.siteUrl },
          ...(p.repoUrl ? { codeRepository: p.repoUrl } : {}),
          ...(p.liveUrl ? { url: p.liveUrl } : {}),
          keywords: p.techStack.join(', '),
        },
      });
    });
  }
}
