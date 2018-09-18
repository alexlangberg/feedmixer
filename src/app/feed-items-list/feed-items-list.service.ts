import { Injectable } from '@angular/core';
import { Jsonfeed } from '../shared/models/jsonfeed.model';
import { Subject } from 'rxjs';

@Injectable()
export class FeedItemsListService {
  feedChanged = new Subject<Jsonfeed>();
  private feed: Jsonfeed;

  constructor() {}

  getFeed(): Jsonfeed {
    return this.feed;
  }

  setFeed(feed: Jsonfeed) {
    this.feed = feed;
    this.feedChanged.next(this.feed);
  }
}
