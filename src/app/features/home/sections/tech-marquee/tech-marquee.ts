import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../../core/content/content.store';

@Component({
  selector: 'app-tech-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="marquee-band" aria-label="Technologies I work with">
      <p class="visually-hidden">{{ skills.join(', ') }}</p>
      <div class="marquee" aria-hidden="true">
        <div class="marquee__track">
          @for (copy of [0, 1]; track copy) {
            @for (s of skills; track s) {
              <span>{{ s }}</span><span class="marquee__sep">✦</span>
            }
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .marquee-band {
      padding: 22px 0;
      background: var(--surface);
      border-block: 1px solid var(--line);
    }
    .marquee__track {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--faint);
      white-space: nowrap;
    }
  `,
})
export class TechMarquee {
  protected readonly skills = inject(ContentStore).marqueeSkills;
}
