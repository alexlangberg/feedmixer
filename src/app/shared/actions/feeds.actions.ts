import { Jsonfeed } from '../models/jsonfeed.model';
import { JsonfeedItem } from '../models/jsonfeed-item.model';

export class SetFeed {
  static readonly type = '[FEEDS] Set feed';
  constructor(public payload: { url: string, feed: Jsonfeed}) {}
}

export class UpdateFeed {
  static readonly type = '[FEEDS] Update feed';
  constructor(public payload: { url: string, feed: Jsonfeed}) {}
}

export class SetSelectedFeedItem {
  static readonly type = '[FEEDS] Set selected feed item';
  constructor(public payload: { feedItem: JsonfeedItem}) {}
}
