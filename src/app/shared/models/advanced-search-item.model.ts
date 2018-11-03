import { JsonfeedItem } from './jsonfeed-item.model';

export class AdvancedSearchItem {
  constructor(
    public name: string,
    public words: string[],
    public mode: 'or' | 'and',
    public active: boolean,
    public hits: JsonfeedItem[]
  ) {}
}
