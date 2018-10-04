import { Injectable } from '@angular/core';
import { Jsonfeed } from '../shared/models/jsonfeed.model';
import { Subject } from 'rxjs';

@Injectable()
export class FeedService {
  feedChanged = new Subject<Jsonfeed>();
  private feed: Jsonfeed;

  constructor() {}

  setFeed(feed: Jsonfeed) {
    this.feed = feed;
    this.feedChanged.next(this.feed);
  }
}
