import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Feed2jsonService {
  constructor(private http: HttpClient) {}

  getFeedFromUrl(rss_url: string): Observable<Object> {
    return this.http.get('http://localhost:4201/convert?url=' + rss_url);
  }
}
