import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';
import { SetIsSidenavOpenStatus, SetScreenSize, SetSidenavs } from './ui.actions';
import { OnDestroy } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';

export interface UiStateModel {
  size: string;
  feedTableColumns: string[];
  isSidenavOpen: boolean;
  isSidenavEndOpen: boolean;
}

@State<UiStateModel>({
  name: 'ui',
  defaults: {
    size: 'xs',
    feedTableColumns: ['title', 'options'],
    isSidenavOpen: false,
    isSidenavEndOpen: false
  }
})

export class UiState implements OnDestroy {
  private sidenav: MatSidenav;
  private sidenavEnd: MatSidenav;
  private sidenavOpening$: Subscription;
  private sidenavClosing$: Subscription;
  private sidenavEndOpening$: Subscription;
  private sidenavEndClosing$: Subscription;
  private mediaSub$: Subscription;

  constructor(
    private store: Store,
    private media$: ObservableMedia
  ) {
    this.mediaSub$ = this.media$
      .subscribe(change => {
        if (change) {
          this.store.dispatch(new SetScreenSize({
            size: change.mqAlias
          }));

          this.adjustSidenavs(change.mqAlias);
        }
      });
  }

  @Selector()
  static get(state: UiStateModel) {
    return state;
  }

  ngOnDestroy() {
    if (this.sidenavOpening$) {
      this.sidenavOpening$.unsubscribe();
    }

    if (this.sidenavClosing$) {
      this.sidenavClosing$.unsubscribe();
    }

    if (this.sidenavEndOpening$) {
      this.sidenavOpening$.unsubscribe();
    }

    if (this.sidenavEndClosing$) {
      this.sidenavClosing$.unsubscribe();
    }

    if (this.mediaSub$) {
      this.mediaSub$.unsubscribe();
    }
  }

  private adjustSidenavs(size: string) {
    this.store.dispatch(new SetIsSidenavOpenStatus({
      sidenav: 'start',
      isOpen: ['md', 'lg', 'xl'].includes(size)
    }));

    this.store.dispatch(new SetIsSidenavOpenStatus({
      sidenav: 'end',
      isOpen: ['lg', 'xl'].includes(size)
    }));
  }

  @Action(SetSidenavs)
  setSidenav(ctx: StateContext<UiStateModel>, action: SetSidenavs) {
    this.sidenav = action.payload.sidenav;
    this.sidenavEnd = action.payload.sidenavEnd;

    this.sidenavOpening$ = this.sidenav.openedStart.subscribe(() => {
      this.store.dispatch(new SetIsSidenavOpenStatus({
        sidenav: 'start',
        isOpen: true
      }));
    });

    this.sidenavClosing$ = this.sidenav.closedStart.subscribe(() => {
      this.store.dispatch(new SetIsSidenavOpenStatus({
        sidenav: 'start',
        isOpen: false
      }));
    });

    this.sidenavEndOpening$ = this.sidenavEnd.openedStart.subscribe(() => {
      this.store.dispatch(new SetIsSidenavOpenStatus({
        sidenav: 'end',
        isOpen: true
      }));
    });

    this.sidenavEndClosing$ = this.sidenavEnd.closedStart.subscribe(() => {
      this.store.dispatch(new SetIsSidenavOpenStatus({
        sidenav: 'end',
        isOpen: false
      }));
    });
  }

  @Action(SetIsSidenavOpenStatus)
  setIsSidenavOpenStatus(ctx: StateContext<UiStateModel>, action: SetIsSidenavOpenStatus) {
    if (action.payload.sidenav === 'start') {
      ctx.patchState({
        isSidenavOpen: action.payload.isOpen
      });
    } else {
      ctx.patchState({
        isSidenavEndOpen: action.payload.isOpen
      });
    }
  }

  @Action(SetScreenSize)
  setScreenSize(ctx: StateContext<UiStateModel>, action: SetScreenSize) {
    const columns = ['xs', 'sm'].includes(action.payload.size)
      ? ['title', 'options']
      : ['date_published', 'title', 'options'];

    ctx.patchState({
      size: action.payload.size,
      feedTableColumns: columns
    });
  }
}
