import { contentfulImageLoader } from './contentful-image-loader';

describe('contentfulImageLoader', () => {
  const src = 'https://images.ctfassets.net/space/asset/hash/shot.png';

  it('requests WebP at the given width, cropped to the ratio', () => {
    const url = new URL(contentfulImageLoader({ src, width: 800, loaderParams: { ratio: 16 / 10 } }));
    expect(url.searchParams.get('w')).toBe('800');
    expect(url.searchParams.get('h')).toBe('500');
    expect(url.searchParams.get('fit')).toBe('fill');
    expect(url.searchParams.get('fm')).toBe('webp');
  });

  it('leaves non-Contentful URLs untouched', () => {
    expect(contentfulImageLoader({ src: 'https://example.com/a.png', width: 400 })).toBe('https://example.com/a.png');
  });

  it('serves the 640 px variant of local covers for small slots', () => {
    expect(contentfulImageLoader({ src: '/images/projects/a.webp', width: 384 })).toBe('/images/projects/a-640.webp');
    expect(contentfulImageLoader({ src: '/images/projects/a.webp', width: 1080 })).toBe('/images/projects/a.webp');
  });
});
