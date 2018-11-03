import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SetAdvancedSearchItem, SetCurrentAdvancedSearchItem, SetCurrentSimpleSearch } from './search.actions';
import { AdvancedSearchItem } from '../models/advanced-search-item.model';
import { UpdateAdvancedSearchHits } from './search.actions';
import { Jsonfeed } from '../models/jsonfeed.model';
import { FeedsState } from './feeds.state';
export interface SearchStateModel {
  mode: 'simple' | 'advanced';
  simple: {
    current: string
  };
  advanced: {
    saved: AdvancedSearchItem[]
  };
}

@State<SearchStateModel>({
  name: 'search',
  defaults: {
    mode: 'simple',
    simple: {
      current: ''
    },
    advanced: {
      saved: [new AdvancedSearchItem('Test', ['kashoggi', 'saudi', 'trump'], 'or', false, 0)]
    }
  }
})

export class SearchState {

  constructor(private store: Store) {}

  @Selector()
  static getCurrentSimpleSearch(state: SearchStateModel) {
    return state.simple.current;
  }

  @Selector()
  static getCurrentAdvancedSearch(state: SearchStateModel) {
    return state.advanced.saved.find(item => item.active);
  }

  @Selector()
  static getCurrentSearchMode(state: SearchStateModel) {
    return state.mode;
  }

  @Selector()
  static getSavedAdvancedSearches(state: SearchStateModel): AdvancedSearchItem[] {
    return state.advanced.saved.sort((a, b) => a.name.localeCompare(b.name));
  }

  @Action(SetCurrentSimpleSearch)
  setCurrentSimpleSearch(ctx: StateContext<SearchStateModel>, action: SetCurrentSimpleSearch) {
    ctx.patchState({
      mode: 'simple',
      simple: {
        current: action.payload
      }
    });
  }

  @Action(SetCurrentAdvancedSearchItem)
  setCurrentAdvancedSearchItem(ctx: StateContext<SearchStateModel>, action: SetCurrentAdvancedSearchItem) {
    const state = ctx.getState();
    const mapped = state.advanced.saved
      .map(item => {
        item.active = item.name === action.payload;

        return item;
      });

    ctx.patchState({
      mode: 'advanced',
      advanced: {
        ...state.advanced,
        saved: mapped
      }
    });
  }

  @Action(SetAdvancedSearchItem)
  SetAdvancedSearchItem(ctx: StateContext<SearchStateModel>, action: SetAdvancedSearchItem) {
    const state = ctx.getState();
    const name = action.payload.name;
    let saved = state.advanced.saved;
    const existing = saved.find(item => item.name === name);

    if (existing) {
      saved = saved.map(item => {
        if (item.name === name) {
          return action.payload;
        } else {
          return item;
        }
      });
    } else {
      saved.push(action.payload);
    }

    ctx.patchState({
      ...state,
      advanced: {
        ...state.advanced,
        saved: saved
      }
    });

    this.store.dispatch(new UpdateAdvancedSearchHits());
  }

  @Action(UpdateAdvancedSearchHits)
  updateAdvancedSearchHits(ctx: StateContext<SearchStateModel>) {
    const state = ctx.getState();
    const activeFeeds = this.store.selectSnapshot(FeedsState.getActiveFeeds);
    const searches = this.store.selectSnapshot(SearchState.getSavedAdvancedSearches);

    const searchesHits = searches.map(search => {
      return {
        ... search,
        hits: this.filterAdvancedSearch(activeFeeds, search).length
      };
    });

    console.log(searchesHits);

    ctx.patchState({
      ...state,
      advanced: {
        ...state.advanced,
        saved: searchesHits
      }
    });
  }

  private filterAdvancedSearch(feeds: Jsonfeed[], search: AdvancedSearchItem) {
    return search.mode === 'or'
      ? this.filterAdvancedSearchOr(feeds, search)
      : this.filterAdvancedSearchAnd(feeds, search);
  }

  private filterAdvancedSearchOr(feeds: Jsonfeed[], search: AdvancedSearchItem) {
    return feeds.map(feed => {
      return feed.items.filter(item => {
        return item._feedmixer.tags
          .filter(tag => search.words.includes(tag))
          .length > 0;
      });
    }).reduce((acc, curr) => acc.concat(curr));
  }

  private filterAdvancedSearchAnd(feeds: Jsonfeed[], search: AdvancedSearchItem) {
    return feeds.map(feed => {
      return feed.items.filter(item => {
        return search.words
          .filter(word => item._feedmixer.tags.includes(word))
          .length === search.words.length;
      });
    }).reduce((acc, curr) => acc.concat(curr));
  }
}
