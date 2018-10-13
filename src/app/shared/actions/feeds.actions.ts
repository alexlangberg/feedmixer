import { Jsonfeed } from '../models/jsonfeed.model';

export class SetFeed {
  static readonly type = '[FEEDS] Set feed';
  constructor(public payload: { url: string, feed: Jsonfeed}) {}
}

export class UpdateFeed {
  static readonly type = '[FEEDS] Update feed';
  constructor(public payload: { url: string, feed: Jsonfeed}) {}
}
