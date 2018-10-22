import { AdvancedSearchItem } from '../models/advanced-search-item.model';

export class SetCurrentSimpleSearch {
  static readonly type = '[SEARCH] Set search';
  constructor(public payload: string) {}
}

export class SetAdvancedSearchItem {
  static readonly type = '[SEARCH] Add advanced search item';
  constructor(public payload: AdvancedSearchItem) {}
}

export class SetCurrentAdvancedSearchItem {
  static readonly type = '[SEARCH] Set current advanced search item';
  constructor(public payload: string) {}
}
