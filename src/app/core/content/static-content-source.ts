import { Injectable } from '@angular/core';
import snapshot from '@content';
import { ContentSource } from './content-source';
import { PortfolioContent } from './portfolio.models';

/**
 * Serves the build-time snapshot written by `scripts/content-pull.mjs`.
 *
 * `@content` (tsconfig "paths") resolves to `src/content/content.json` when it exists and
 * falls back to the committed `content/content.seed.json`, so `ng serve` / `ng build` work
 * even if the pull step was skipped. Both files follow the validated content schema.
 * Visitors never call Contentful.
 */
@Injectable()
export class StaticContentSource extends ContentSource {
  override readonly content = snapshot as unknown as PortfolioContent;
}
