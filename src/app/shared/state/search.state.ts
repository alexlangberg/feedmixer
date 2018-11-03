import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetAdvancedSearchItem, SetCurrentAdvancedSearchItem, SetCurrentSimpleSearch } from './search.actions';
import { AdvancedSearchItem } from '../models/advanced-search-item.model';
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
      saved: [new AdvancedSearchItem('Test', ['kashoggi', 'saudi', 'trump'], 'or', false)]
    }
  }
})

export class SearchState {

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
  }
}
