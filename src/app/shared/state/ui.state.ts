import { Selector, State } from '@ngxs/store';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';

export interface UiStateModel {
  sidenav: MatSidenav | undefined;
  sidenavEnd: MatSidenav | undefined;
  isSidenavOpen: boolean;
  isSidenavEndOpen: boolean;
  sidenavMode: string;
  sidenavEndMode: string;
}

@State<UiStateModel>({
  name: 'ui',
  defaults: {
    sidenav: undefined,
    sidenavEnd: undefined,
    isSidenavOpen: false,
    isSidenavEndOpen: false,
    sidenavMode: 'over',
    sidenavEndMode: 'over'
  }
})

export class UiState {
  private sidenavOpening$: Subscription;
  private sidenavClosing$: Subscription;
  private sidenavEndOpening$: Subscription;
  private sidenavEndClosing$: Subscription;

  constructor() {
  }

  @Selector()
  static get(state: UiStateModel) {
    return state;
  }

  // @Action(SetCurrentSearch)
  // setCurrentSearch(ctx: StateContext<UiStateModel>, action: UiStateModel) {
  //   ctx.patchState({
  //     current: action.payload
  //   });
  // }
}
