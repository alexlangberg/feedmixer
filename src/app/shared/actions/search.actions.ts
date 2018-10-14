export class SetCurrentSearch {
  static readonly type = '[SEARCH] Set search';
  constructor(public payload: string) {}
}
