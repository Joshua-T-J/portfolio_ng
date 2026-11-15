import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentStore } from '../../core/content/content.store';
import { Icon } from '../../shared/ui/icon/icon';
import { NAV_LINKS } from '../nav-links';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly links = NAV_LINKS;
  protected readonly settings = inject(ContentStore).settings;
  protected readonly year = new Date().getFullYear();
  protected readonly wordmark = this.settings.name.toLowerCase();

  protected readonly elsewhere = [
    { label: 'GitHub', url: this.settings.githubUrl },
    { label: 'LinkedIn', url: this.settings.linkedinUrl },
    { label: 'Instagram', url: this.settings.instagramUrl },
    { label: 'Photography', url: this.settings.photographyUrl },
  ].filter((l): l is { label: string; url: string } => Boolean(l.url));

  private readonly document = inject(DOCUMENT);

  /**
   * Scrolls to the very top on any page (home or project detail) and moves keyboard focus
   * to the main landmark, so screen-reader and keyboard users land at the top as well.
   */
  protected backToTop(): void {
    const win = this.document.defaultView;
    if (!win) return;
    const reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    win.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    this.document.getElementById('main')?.focus({ preventScroll: true });
    if (win.location.hash) {
      win.history.replaceState(win.history.state, '', win.location.pathname + win.location.search);
    }
  }
}
