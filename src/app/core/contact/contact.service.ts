import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, timeout } from 'rxjs';
import { ContentStore } from '../content/content.store';

/** Give up on the form endpoint after this long so the user always gets an answer. */
export const CONTACT_TIMEOUT_MS = 15000;

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

/**
 * Sends the contact form to the Google Apps Script endpoint.
 * Field names (Name, Email, Phone, Subject, Message) match the existing sheet columns.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = inject(ContentStore).config.contactEndpoint;

  get isConfigured(): boolean {
    return Boolean(this.endpoint);
  }

  send(msg: ContactMessage): Observable<void> {
    if (!this.endpoint) throw new Error('Contact endpoint is not configured');
    const body = new FormData();
    body.append('Name', msg.name);
    body.append('Email', msg.email);
    body.append('Phone', '');
    body.append('Subject', msg.subject || 'Portfolio enquiry');
    body.append('Message', msg.message);
    return this.http.post<{ result?: string }>(this.endpoint, body).pipe(
      timeout(CONTACT_TIMEOUT_MS),
      map((res) => {
        if (res?.result !== 'success') throw new Error('Form endpoint did not confirm success');
      }),
    );
  }
}
