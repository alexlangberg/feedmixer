import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class LayoutService implements OnDestroy {
  sidenav: MatSidenav;
  screenSize: string;
  isSidenavOpen: boolean;
  isSidenavAlwaysOpen: boolean;
  sidenavPosition: string;
  toolbarHeight: number;
  private readonly mediaWatcher: Subscription;

  constructor(private media$: ObservableMedia) {
    this.mediaWatcher = media$.subscribe((change: MediaChange) => {
      this.screenSize = change.mqAlias;

      if (['xs'].includes(this.screenSize)) {
        this.toolbarHeight = 56;
      } else {
        this.toolbarHeight = 64;
      }

      if (['xs', 'sm'].includes(this.screenSize)) {
        this.isSidenavOpen = false;
        this.sidenavPosition = 'over';
        this.isSidenavAlwaysOpen = false;
      } else {
        this.isSidenavOpen = true;
        this.sidenavPosition = 'side';
        this.isSidenavAlwaysOpen = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.mediaWatcher) {
      this.mediaWatcher.unsubscribe();
    }
  }

  doToggleSidenav() {
    this.sidenav.toggle();
  }
}
