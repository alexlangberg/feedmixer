import { Action, Selector, State, StateContext } from '@ngxs/store';

export interface UiStateModel {
  current: string;
}

@State<UiStateModel>({
  name: 'search',
  defaults: {
    current: ''
  }
})

export class UiState {

  @Selector()
  static getCurrentSearch(state: UiStateModel) {
    return state.current;
  }

  //@Action(SetCurrentSearch)
  //setCurrentSearch(ctx: StateContext<UiStateModel>, action: UiStateModel) {
  //  ctx.patchState({
  //    current: action.payload
  //  });
  //}
}
