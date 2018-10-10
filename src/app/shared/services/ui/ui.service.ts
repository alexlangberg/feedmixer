import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
  sidenav: MatSidenav;
  sidenavEnd: MatSidenav;
  isSidenavOpen: boolean;
  isSidenavEndOpen: boolean;
  sidenavMode: string;
  sidenavEndMode: string;
  private readonly mediaWatcher$: Subscription;

  constructor(private media$: ObservableMedia) {
    this.mediaWatcher$ = media$.subscribe((change: MediaChange) => {
      this.screenSize = change.mqAlias;

      if (['xs', 'sm'].includes(this.screenSize)) {
        this.small = true;
        this.medium = this.large = false;
      } else if (['md'].includes(this.screenSize)) {
        this.medium = true;
        this.small = this.large = false;
      } else {
        this.large = true;
        this.small = this.medium = false;
      }

      if (this.small) {
        this.isSidenavOpen = this.isSidenavEndOpen = false;
        this.sidenavMode = this.sidenavEndMode = 'over';
      } else {
        this.isSidenavOpen = this.isSidenavEndOpen = true;
        this.sidenavMode = this.sidenavEndMode = 'side';
      }
    });
  }

  ngOnDestroy() {
    if (this.mediaWatcher$) {
      this.mediaWatcher$.unsubscribe();
    }
  }

  doToggleSidenav() {
    this.sidenav.toggle();
  }

  doToggleSidenavEnd() {
    this.sidenavEnd.toggle();
  }
}
