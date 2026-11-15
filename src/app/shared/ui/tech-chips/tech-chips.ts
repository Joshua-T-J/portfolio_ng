import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Chip list that shows at most `max` items and a "+N" chip for the rest, so long stacks never wrap into a wall. */
@Component({
  selector: 'app-tech-chips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="chips" [attr.aria-label]="label()">
      @for (item of visible(); track item) {
        <li class="chip">{{ item }}</li>
      }
      @if (hiddenCount() > 0) {
        <li class="chip chip--more" [attr.title]="hidden().join(', ')">+{{ hiddenCount() }}</li>
      }
    </ul>
  `,
})
export class TechChips {
  readonly items = input.required<readonly string[]>();
  readonly max = input(6);
  readonly label = input('Technologies');

  protected readonly visible = computed(() => this.items().slice(0, this.max()));
  protected readonly hidden = computed(() => this.items().slice(this.max()));
  protected readonly hiddenCount = computed(() => this.hidden().length);
}
