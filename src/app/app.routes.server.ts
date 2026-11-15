import { RenderMode, ServerRoute } from '@angular/ssr';
import snapshot from '@content';

/**
 * Every page is prerendered to static HTML at build time (outputMode: "static").
 * Project pages come from the same content snapshot the app renders.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return snapshot.projects.map((p: { slug: string }) => ({ slug: p.slug }));
    },
  },
  // Copied to 404.html by scripts/postbuild.mjs; Vercel serves it for unknown URLs.
  { path: '404', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
