import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { Provider } from '@angular/core';

export interface ContentfulImageParams {
  /** Width / height ratio to crop to, e.g. 16 / 10. Omit to keep the original ratio. */
  readonly ratio?: number;
}

const CONTENTFUL_HOST = 'images.ctfassets.net';

/** Local covers in /public/images ship as `<name>.webp` (1200 px) plus `<name>-640.webp`. */
const LOCAL_SMALL_WIDTH = 640;
const LOCAL_IMAGE = /^\/images\/.+\.webp$/;

function localImage(src: string, width?: number): string {
  return width && width <= LOCAL_SMALL_WIDTH ? src.replace(/\.webp$/, `-${LOCAL_SMALL_WIDTH}.webp`) : src;
}

/**
 * Serves Contentful images at the exact width requested, as WebP, cropped from the top
 * when a ratio is given. Keeps bandwidth low (Free plan: 50 GB/month).
 * Local images under /images/ get a 640 px variant for small slots.
 */
export function contentfulImageLoader(config: ImageLoaderConfig): string {
  if (LOCAL_IMAGE.test(config.src)) return localImage(config.src, config.width);

  let url: URL;
  try {
    url = new URL(config.src);
  } catch {
    return config.src;
  }
  if (url.hostname !== CONTENTFUL_HOST) return config.src;

  const params = (config.loaderParams ?? {}) as ContentfulImageParams;
  if (config.width) {
    url.searchParams.set('w', String(config.width));
    if (params.ratio) {
      url.searchParams.set('h', String(Math.round(config.width / params.ratio)));
      url.searchParams.set('fit', 'fill');
      url.searchParams.set('f', 'top');
    }
  }
  url.searchParams.set('fm', 'webp');
  url.searchParams.set('q', '75');
  return url.toString();
}

export const provideContentfulImageLoader = (): Provider => ({
  provide: IMAGE_LOADER,
  useValue: contentfulImageLoader,
});
