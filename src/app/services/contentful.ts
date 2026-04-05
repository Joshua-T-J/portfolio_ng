import { Injectable } from '@angular/core';
import { createClient, Entry } from 'contentful';
import { Observable, from, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ISkillsData } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root',
})
export class Contentful {
  private cdaClient = createClient({
    space: environment.space,
    accessToken: environment.accessToken,
  });

  // ── Resolve a protocol-relative Contentful URL to https ──
  static resolveUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('//')) return `https:${url}`;
    return url;
  }

  getProjects(query?: object): Observable<Entry<any>[]> {
    return from(
      this.cdaClient
        .getEntries({ content_type: environment.contentTypeIds.project, ...query })
        .then((res) => res.items),
    );
  }

  getProjectTypes(query?: object): Observable<Entry<any>[]> {
    return from(
      this.cdaClient
        .getEntries({ content_type: environment.contentTypeIds.projectTypes, ...query })
        .then((res) => res.items),
    );
  }

  getProjectDetails(contentType: string): Observable<Entry<any>[]> {
    return from(this.cdaClient.getEntries({ content_type: contentType }).then((res) => res.items));
  }

  getSingleProject(id: string): Observable<Entry<any>> {
    return from(this.cdaClient.getEntry(id));
  }

  getResume(query?: object): Observable<Entry<any>[]> {
    return from(
      this.cdaClient
        .getEntries({ content_type: environment.contentTypeIds.resume, ...query })
        .then((res) => res.items),
    );
  }

  /**
   * Returns the parsed `skills` JSON object from the Resume Details entry
   * whose `type` field equals 'Skills'.
   *
   * Contentful `skills` field (type: Object) should contain:
   * {
   *   skillCategories: [ { label, icon, skills: [{ title, pct, color }] } ],
   *   tools: [ { name, color, category, imageSrc } ]
   * }
   *
   * For each tool, store the Contentful Asset URL directly in `imageSrc`
   * (e.g. "//images.ctfassets.net/..."). This service resolves the protocol.
   */
  getSkillsData(): Observable<ISkillsData | null> {
    return this.getResume().pipe(
      map((entries) => {
        const skillsEntry = entries.find((e: any) => e.fields?.type === 'Skills');
        if (!skillsEntry) return null;

        const raw = (skillsEntry as any).fields?.skills as ISkillsData | undefined;
        if (!raw) return null;

        // Normalise tool image URLs (protocol-relative → https)
        if (raw.tools) {
          raw.tools = raw.tools.map((t) => ({
            ...t,
            imageSrc: Contentful.resolveUrl(t.imageSrc),
            icon: t.icon ? Contentful.resolveUrl(t.icon) : undefined,
          }));
        }

        return raw;
      }),
    );
  }
}
