import { JsonfeedAuthor } from './jsonfeed-author.model';
import { JsonfeedHub } from './jsonfeed-hub.model';
import { JsonfeedItem } from './jsonfeed-item.model';

export class Jsonfeed {
  constructor(
    public _feedmixer: { url: string, language?: string },
    public version: string,
    public title: string,
    public items: JsonfeedItem[],
    public home_page_url?: string,
    public feed_url?: string,
    public description?: string,
    public user_comment?: string,
    public next_url?: string,
    public icon?: string,
    public favicon?: string,
    public author?: JsonfeedAuthor,
    public expired?: boolean,
    public hubs?: JsonfeedHub[]
  ) {}
}
