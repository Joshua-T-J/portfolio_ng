import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../../core/content/content.store';

@Component({
  selector: 'app-about-section',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="container section" aria-labelledby="about-title">
      <div class="about reveal">
        @if (s.headshot; as img) {
          <div class="about__photo">
            <img [ngSrc]="img.url" [alt]="img.alt" fill sizes="(max-width: 600px) 70vw, 22vw" [loaderParams]="{ ratio: 4 / 5 }" />
          </div>
        }
        <div class="about__text">
          <span class="tag">05 · About</span>
          <h2 id="about-title" class="h2 about__title">{{ s.aboutTitle }}</h2>
          <p class="text-2 about__body">{{ s.about }}</p>
          @if (s.photographyUrl) {
            <a class="link" [href]="s.photographyUrl" target="_blank" rel="noopener">See my photography ↗</a>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .about { display: flex; flex-wrap: wrap; align-items: center; gap: 48px; }
    .about__photo {
      position: relative; flex: 0 1 260px; aspect-ratio: 4 / 5;
      border-radius: var(--radius-lg); overflow: hidden; background: var(--soft);
    }
    .about__photo img { object-fit: cover; }
    .about__text { flex: 999 1 420px; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
    .about__title { font-size: clamp(32px, 4vw, 44px); }
    .about__body { margin: 0; font-size: 17.5px; line-height: 1.7; max-width: 720px; }
  `,
})
export class AboutSection {
  protected readonly s = inject(ContentStore).settings;
}
