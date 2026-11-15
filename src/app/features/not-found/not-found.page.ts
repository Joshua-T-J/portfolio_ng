import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container nf" aria-labelledby="nf-title">
      <p class="tag">404</p>
      <h1 id="nf-title" class="nf__title">This page doesn't exist.</h1>
      <p class="text-2">The link may be old, or the project may have moved.</p>
      <div class="nf__cta">
        <a class="btn btn--primary" routerLink="/">Go to the home page</a>
        <a class="btn btn--outline" routerLink="/" fragment="work">See my work</a>
      </div>
    </section>
  `,
  styles: `
    .nf { min-height: 60vh; padding-top: 120px; display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
    .nf__title { margin: 0; font-family: var(--font-display); font-size: clamp(40px, 6vw, 72px); letter-spacing: -0.04em; line-height: 1; }
    .nf p { margin: 0; font-size: 18px; }
    .nf__cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
  `,
})
export class NotFoundPage {
  constructor() {
    inject(SeoService).set({
      title: 'Page not found',
      description: 'This page does not exist. Go back to the portfolio home page to see projects and experience.',
      path: '/404',
      noIndex: true,
    });
  }
}
