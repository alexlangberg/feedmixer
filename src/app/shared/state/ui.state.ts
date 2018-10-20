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
  private size: string | undefined = undefined;
  private isSidenavListersSetup = false;
  private isSidenavEndListersSetup = false;

  constructor(
    private store: Store,
    private media$: ObservableMedia
  ) {
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

  @Action(SetSidenavs)
  setSidenavs(ctx: StateContext<UiStateModel>, action: SetSidenavs) {
    this.sidenav = action.payload.sidenav;
    this.sidenavEnd = action.payload.sidenavEnd;

    this.mediaSub$ = this.media$
      .subscribe(change => {
        const size = change.mqAlias;

        if (!this.size || this.size !== size) {
          this.store.dispatch(new SetScreenSize({
            size: size
          }));

          this.adjustSidenavs(size);

          this.size = size;
        }
      });
  }

  private adjustSidenavs(size: string) {
    this.store.dispatch(new SetIsSidenavOpenStatus({
      sidenav: 'start',
      isOpen: ['md', 'lg', 'xl'].includes(size)
    })).subscribe(() => {
      if (!this.isSidenavListersSetup) {
        this.isSidenavListersSetup = true;
        this.setUpSidenavListeners();
      }
    });

    this.store.dispatch(new SetIsSidenavOpenStatus({
      sidenav: 'end',
      isOpen: ['lg', 'xl'].includes(size)
    })).subscribe(() => {
      if (!this.isSidenavEndListersSetup) {
        this.isSidenavEndListersSetup = true;
        this.setUpSidenavEndListeners();
      }
    });
  }

  private setUpSidenavListeners() {
    setTimeout(() => {
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

    }, 1);
  }

  private setUpSidenavEndListeners() {
    setTimeout(() => {
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
    }, 1);
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
