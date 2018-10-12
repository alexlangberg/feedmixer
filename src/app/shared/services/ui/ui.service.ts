import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UIService implements OnDestroy {
  screenSize: string;
  small: boolean;
  medium: boolean;
  large: boolean;
  screenSizeChanged$ = new ReplaySubject<string>(1);
  sidenav: MatSidenav;
  sidenavEnd: MatSidenav;
  isSidenavOpen: boolean;
  isSidenavEndOpen: boolean;
  sidenavMode: string;
  sidenavEndMode: string;
  showItemInfo$ = new Subject<string>();
  private readonly mediaWatcher$: Subscription;
  private sidenavOpening$: Subscription;
  private sidenavClosing$: Subscription;
  private sidenavEndOpening$: Subscription;
  private sidenavEndClosing$: Subscription;

  constructor(private media$: ObservableMedia) {
    this.mediaWatcher$ = media$.subscribe((change: MediaChange) => {
      this.screenSize = change.mqAlias;

      if (['xs', 'sm'].includes(this.screenSize)) {
        this.small = true;
        this.medium = this.large = false;
        this.screenSizeChanged$.next('small');
      } else if (['md'].includes(this.screenSize)) {
        this.medium = true;
        this.small = this.large = false;
        this.screenSizeChanged$.next('medium');
      } else {
        this.large = true;
        this.small = this.medium = false;
        this.screenSizeChanged$.next('large');
      }

      if (this.small) {
        this.isSidenavOpen = false;
        this.sidenavMode = 'over';
        this.isSidenavEndOpen = false;
        this.sidenavEndMode = 'over';
      }

      if (this.medium) {
        this.isSidenavOpen = true;
        this.sidenavMode = 'side';
        this.isSidenavEndOpen = false;
        this.sidenavEndMode = 'over';
      }

      if (this.large) {
        this.isSidenavOpen = true;
        this.isSidenavEndOpen = false;
        this.sidenavMode = 'side';
        this.sidenavEndMode = 'side';
      }
    });
  }

  ngOnDestroy() {
    if (this.mediaWatcher$) {
      this.mediaWatcher$.unsubscribe();
    }

    if (this.screenSizeChanged$) {
      this.screenSizeChanged$.unsubscribe();
    }

    if (this.showItemInfo$) {
      this.showItemInfo$.unsubscribe();
    }

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
  }

  setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;

    this.sidenavOpening$ = this.sidenav.openedStart.subscribe(() => {
      this.isSidenavOpen = true;
    });

    this.sidenavClosing$ = this.sidenav.closedStart.subscribe(() => {
      this.isSidenavOpen = false;
    });
  }

  setSidenavEnd(sidenavEnd: MatSidenav) {
    this.sidenavEnd = sidenavEnd;

    this.sidenavEndOpening$ = this.sidenavEnd.openedStart.subscribe(() => {
      this.isSidenavEndOpen = true;
    });

    this.sidenavEndClosing$ = this.sidenavEnd.closedStart.subscribe(() => {
      this.isSidenavEndOpen = false;
    });
  }

  doToggleSidenav() {
    this.sidenav.toggle();
  }

  doToggleSidenavEnd() {
    this.sidenavEnd.toggle();
  }

  onShowItemInfo(url: string) {
    this.showItemInfo$.next(url);
    this.sidenavEnd.open();
  }
}
