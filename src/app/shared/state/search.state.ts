import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetCurrentSearch } from './search.actions';
export interface SearchStateModel {
  current: string;
}

@State<SearchStateModel>({
  name: 'search',
  defaults: {
    current: ''
  }
})

export class SearchState {

  @Selector()
  static getCurrentSearch(state: SearchStateModel) {
    return state.current;
  }

  @Action(SetCurrentSearch)
  setCurrentSearch(ctx: StateContext<SearchStateModel>, action: SetCurrentSearch) {
    ctx.patchState({
      current: action.payload
    });
  }
}
