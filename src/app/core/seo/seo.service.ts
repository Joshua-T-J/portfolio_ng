import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ContentStore } from '../content/content.store';

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  /** Path starting with "/", e.g. "/projects/gistvault". */
  readonly path: string;
  readonly image?: string;
  readonly type?: 'website' | 'article' | 'profile';
  readonly jsonLd?: object | readonly object[];
  readonly noIndex?: boolean;
}

/**
 * Sets title, description, canonical, Open Graph, Twitter and JSON-LD for a page.
 * Runs during prerendering, so every tag is in the static HTML that crawlers read.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly settings = inject(ContentStore).settings;

  set(page: PageSeo): void {
    const url = this.settings.siteUrl + page.path;
    const image = this.absolute(page.image ?? this.settings.ogImage?.url);

    this.title.setTitle(page.title);
    this.tag('name', 'description', page.description);
    this.tag('name', 'robots', page.noIndex ? 'noindex, follow' : 'index, follow');
    this.tag('property', 'og:type', page.type ?? 'website');
    this.tag('property', 'og:site_name', this.settings.name);
    this.tag('property', 'og:title', page.title);
    this.tag('property', 'og:description', page.description);
    this.tag('property', 'og:url', url);
    this.tag('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    this.tag('name', 'twitter:title', page.title);
    this.tag('name', 'twitter:description', page.description);
    if (image) {
      this.tag('property', 'og:image', image);
      this.tag('name', 'twitter:image', image);
    } else {
      this.meta.removeTag("property='og:image'");
      this.meta.removeTag("name='twitter:image'");
    }
    this.canonical(url);
    this.jsonLd(page.jsonLd);
  }

  /** schema.org Person for the home page. */
  personSchema(): object {
    const s = this.settings;
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: s.name,
      url: s.siteUrl,
      jobTitle: 'Full-Stack Engineer',
      email: `mailto:${s.email}`,
      address: { '@type': 'PostalAddress', addressLocality: s.location },
      sameAs: [s.githubUrl, s.linkedinUrl, s.instagramUrl, s.photographyUrl].filter(Boolean),
      ...(s.headshot ? { image: s.headshot.url } : {}),
    };
  }

  /** Social cards need absolute image URLs; local covers are stored as "/images/…". */
  private absolute(url: string | undefined): string | undefined {
    return url?.startsWith('/') ? this.settings.siteUrl + url : url;
  }

  private tag(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content }, `${attr}='${key}'`);
  }

  private canonical(href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private jsonLd(data: PageSeo['jsonLd']): void {
    this.document.head.querySelector('script[data-seo="ld"]')?.remove();
    if (!data) return;
    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo', 'ld');
    // JSON.stringify output cannot contain "</script>" from our own data except via strings; escape "<".
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    this.document.head.appendChild(script);
  }
}
