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

export class UpdateAdvancedSearchHits {
  static readonly type = '[SEARCH] Update advanced search hits';
  constructor() {}
}

export class DisableAdvancedSearch {
  static readonly type = '[SEARCH] Disable advanced search';
  constructor() {}
}

export class SetAdvancedSearchName {
  static readonly type = '[SEARCH] Set advanced search name';
  constructor(public payload: string) {}
}

export class SetAdvancedSearchChips {
  static readonly type = '[SEARCH] Set advanced search chips';
  constructor(public payload: string[]) {}
}

export class AddAdvancedSearchChips {
  static readonly type = '[SEARCH] Add advanced search chips';
  constructor(public payload: string[]) {}
}

export class RemoveAdvancedSearchChips {
  static readonly type = '[SEARCH] Remove advanced search chips';
  constructor(public payload: string[]) {}
}
