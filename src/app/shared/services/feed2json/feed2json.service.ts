import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jsonfeed } from '../../models/jsonfeed.model';
import { FeedItemsListService } from '../../../feed-items-list/feed-items-list.service';

@Injectable()
export class Feed2jsonService {
  constructor(
    private http: HttpClient,
    private feedItemsListService: FeedItemsListService
  ) {}

  getFeed(rss_url: string) {
    this.http.get('http://localhost:4201/convert?url=' + rss_url).subscribe(
        (response: Jsonfeed) => {
          this.feedItemsListService.setFeed(response);
        }
      );
  }
}
