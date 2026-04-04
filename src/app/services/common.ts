import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Common {
  private readonly formsApiUrl = environment.GoogleSheetsAPI;
  readonly loading = signal(false);

  constructor(private http: HttpClient) {}

  setLoading(value: boolean): void {
    this.loading.set(value);
  }

  getLoading(): boolean {
    return this.loading();
  }

  submitForm(formData: FormData): Observable<any> {
    return this.http.post(this.formsApiUrl, formData);
  }
}
