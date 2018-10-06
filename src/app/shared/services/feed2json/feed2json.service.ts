import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jsonfeed } from '../../models/jsonfeed.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Feed2jsonService {
  constructor(private http: HttpClient) {}

  getFeedFromUrl(rss_url: string): Observable<Jsonfeed> {
    const request = <Observable<Jsonfeed>>this.http.get(
      'http://localhost:4201/convert?url=' + rss_url
    );

    return request.pipe(map(item => {
      item._feedmixer = { url: rss_url };

      item.items = item.items.map(post => {
        if (!post.hasOwnProperty('id') && post.guid) { post.id = post.guid; }

        return post;
      });

      return item;
    }));
  }
}
