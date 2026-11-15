import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../../core/content/content.store';
import { SkillIcon } from '../../../../core/content/portfolio.models';
import { Icon, IconName } from '../../../../shared/ui/icon/icon';
import { SectionHeader } from '../../../../shared/ui/section-header/section-header';

const ICONS: Record<SkillIcon, { icon: IconName; tone: string }> = {
  frontend: { icon: 'code', tone: 'tone-blue' },
  backend: { icon: 'braces', tone: 'tone-green' },
  tooling: { icon: 'terminal', tone: 'tone-amber' },
  cloud: { icon: 'cloud', tone: 'tone-blue' },
  design: { icon: 'pen', tone: 'tone-green' },
};

@Component({
  selector: 'app-stack-section',
  imports: [SectionHeader, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="stack" class="container section" aria-labelledby="stack-title">
      <app-section-header eyebrow="04 · Stack" title="What I build with" headingId="stack-title" />
      <ul class="grid-auto" role="list">
        @for (g of groups; track g.title) {
          <li class="card card--lift stack-card reveal">
            <span class="stack-card__icon {{ look(g.icon).tone }}" aria-hidden="true">
              <app-icon [name]="look(g.icon).icon" [size]="22" />
            </span>
            <h3 class="stack-card__title">{{ g.title }}</h3>
            <ul class="chips" [attr.aria-label]="g.title + ' skills'">
              @for (s of g.skills; track s) {
                <li class="chip">{{ s }}</li>
              }
            </ul>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .grid-auto { margin: 0; padding: 0; list-style: none; }
    .stack-card { display: flex; flex-direction: column; gap: 16px; padding: 30px; }
    .stack-card__icon {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .stack-card__title { margin: 0; font-family: var(--font-display); font-size: 21px; }
  `,
})
export class StackSection {
  protected readonly groups = inject(ContentStore).skillGroups;

  protected look(icon: SkillIcon) {
    return ICONS[icon];
  }
}
