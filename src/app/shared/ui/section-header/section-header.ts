import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Eyebrow + H2 (+ optional aside text) used at the top of every home section. */
@Component({
  selector: 'app-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-header reveal">
      <div class="section-header__main">
        <span class="tag">{{ eyebrow() }}</span>
        <h2 class="h2" [id]="headingId()">{{ title() }}</h2>
      </div>
      <ng-content />
    </div>
  `,
})
export class SectionHeader {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly headingId = input.required<string>();
}
