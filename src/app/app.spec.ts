import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { ContentSource } from './core/content/content-source';
import { StaticContentSource } from './core/content/static-content-source';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ContentSource, useClass: StaticContentSource },
      ],
    }).compileComponents();
  });

  it('renders the header, skip link and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.skip-link')).not.toBeNull();
    expect(el.querySelector('nav[aria-label="Primary"]')).not.toBeNull();
    expect(el.querySelector('footer')).not.toBeNull();
  });
});
