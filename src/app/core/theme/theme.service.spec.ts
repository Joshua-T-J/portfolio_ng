import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to "system" and leaves data-theme unset', () => {
    const theme = TestBed.inject(ThemeService);
    TestBed.tick();
    expect(theme.preference()).toBe('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBeFalse();
  });

  it('applies and persists an explicit choice, and clears it for "system"', () => {
    const theme = TestBed.inject(ThemeService);
    theme.set('dark');
    TestBed.tick();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(theme.resolved()).toBe('dark');

    theme.set('system');
    TestBed.tick();
    expect(document.documentElement.hasAttribute('data-theme')).toBeFalse();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('restores a stored preference', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(TestBed.inject(ThemeService).preference()).toBe('light');
  });
});
