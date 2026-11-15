import { CdkMenu, CdkMenuItemRadio, CdkMenuTrigger } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemePreference, ThemeService } from '../../../core/theme/theme.service';
import { Icon, IconName } from '../icon/icon';

interface ThemeOption {
  readonly value: ThemePreference;
  readonly label: string;
  readonly hint: string;
  readonly icon: IconName;
}

const OPTIONS: readonly ThemeOption[] = [
  { value: 'system', label: 'System', hint: 'Follows your device', icon: 'monitor' },
  { value: 'light', label: 'Light', hint: 'Always light', icon: 'sun' },
  { value: 'dark', label: 'Dark', hint: 'Always dark', icon: 'moon' },
];

/**
 * Theme dropdown (System / Light / Dark). Built on CDK Menu for full keyboard support:
 * Enter/Space/Arrow keys open and move, Escape closes and returns focus.
 * `ngSkipHydration` because the icon depends on browser-only state (localStorage, media query).
 */
@Component({
  selector: 'app-theme-menu',
  imports: [CdkMenuTrigger, CdkMenu, CdkMenuItemRadio, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' },
  templateUrl: './theme-menu.html',
  styleUrl: './theme-menu.scss',
})
export class ThemeMenu {
  protected readonly theme = inject(ThemeService);
  protected readonly options = OPTIONS;

  protected readonly triggerIcon = computed<IconName>(() =>
    this.theme.resolved() === 'dark' ? 'moon' : 'sun',
  );

  protected readonly triggerLabel = computed(() => {
    const pref = this.theme.preference();
    const name = OPTIONS.find((o) => o.value === pref)?.label ?? 'System';
    return pref === 'system' ? `Theme: ${name} (${this.theme.resolved()})` : `Theme: ${name}`;
  });

  protected select(value: ThemePreference): void {
    this.theme.set(value);
  }
}
