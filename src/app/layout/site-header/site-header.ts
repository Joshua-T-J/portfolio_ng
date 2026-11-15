import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContentStore } from '../../core/content/content.store';
import { Icon } from '../../shared/ui/icon/icon';
import { ThemeMenu } from '../../shared/ui/theme-menu/theme-menu';
import { NAV_LINKS } from '../nav-links';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, Icon, ThemeMenu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: { '(document:keydown.escape)': 'closeMobile()' },
})
export class SiteHeader {
  protected readonly links = NAV_LINKS;
  protected readonly settings = inject(ContentStore).settings;
  protected readonly mobileOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.mobileOpen.set(false));
  }

  protected toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  protected closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
