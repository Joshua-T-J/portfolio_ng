import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Theme preference with "system" as the default.
 *
 * - "system" removes `data-theme` from <html>, so CSS follows `prefers-color-scheme`.
 * - "light" / "dark" set `data-theme` and are persisted in localStorage.
 * - An inline script in index.html applies the stored value before first paint (no flash).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly preference = signal<ThemePreference>(this.readStored());
  private readonly systemDark = signal(this.isBrowser && this.mediaQuery()?.matches === true);

  readonly resolved = computed<ResolvedTheme>(() => {
    const pref = this.preference();
    if (pref !== 'system') return pref;
    return this.systemDark() ? 'dark' : 'light';
  });

  constructor() {
    if (!this.isBrowser) return;

    const mq = this.mediaQuery();
    if (mq) {
      const onChange = (e: MediaQueryListEvent) => this.systemDark.set(e.matches);
      mq.addEventListener('change', onChange);
      inject(DestroyRef).onDestroy(() => mq.removeEventListener('change', onChange));
    }

    effect(() => this.apply(this.preference()));
  }

  set(preference: ThemePreference): void {
    this.preference.set(preference);
  }

  private apply(preference: ThemePreference): void {
    const root = this.document.documentElement;
    if (preference === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', preference);
    }
    try {
      if (preference === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Storage blocked (private mode, embedded iframe): the choice still applies for this visit.
    }
  }

  private readStored(): ThemePreference {
    if (!this.isBrowser) return 'system';
    try {
      const v = localStorage.getItem(THEME_STORAGE_KEY);
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch {
      return 'system';
    }
  }

  private mediaQuery(): MediaQueryList | undefined {
    return typeof matchMedia === 'function' ? matchMedia(DARK_QUERY) : undefined;
  }
}
