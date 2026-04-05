import { Injectable } from '@angular/core';
import { Asset, createClient, Entry } from 'contentful';
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
   */
  getSkillsIcon(assetId: string): Observable<Asset> {
    return from(this.cdaClient.getAsset(assetId).then((res) => res));
  }
}
