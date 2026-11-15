import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../../core/content/content.store';

@Component({
  selector: 'app-stats-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (stats.length) {
      <section class="container stats-wrap" aria-label="At a glance">
        <dl class="stats reveal">
          @for (s of stats; track s.label) {
            <div class="stats__item">
              <dt class="stats__label">{{ s.label }}</dt>
              <dd class="stats__value">{{ s.value }}</dd>
            </div>
          }
        </dl>
      </section>
    }
  `,
  styles: `
    .stats-wrap { padding-top: 64px; }
    .stats {
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
      gap: 1px;
      background: var(--line);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .stats__item {
      display: flex;
      flex-direction: column-reverse;
      justify-content: flex-end;
      gap: 6px;
      padding: 28px;
      background: var(--surface);
    }
    .stats__value {
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(34px, 4vw, 44px);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.1;
    }
    .stats__label { font-size: 15px; color: var(--muted); }
  `,
})
export class StatsStrip {
  protected readonly stats = inject(ContentStore).settings.stats;
}
