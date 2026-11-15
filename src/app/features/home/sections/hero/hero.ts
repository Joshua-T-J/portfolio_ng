import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../../../core/content/content.store';
import { Icon, IconName } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly store = inject(ContentStore);
  protected readonly s = this.store.settings;
  protected readonly nowBuilding = this.store.nowBuilding;
  /** First word repeated at the end so the CSS loop wraps seamlessly. */
  protected readonly words = [...this.s.rotatingWords, this.s.rotatingWords[0]];
  protected readonly wordsText = this.s.rotatingWords.join(' ');
  protected readonly cycle = `rot-${this.s.rotatingWords.length}`;

  protected iconFor(i: number): IconName {
    return i === 0 ? 'terminal' : 'scan-face';
  }
}
