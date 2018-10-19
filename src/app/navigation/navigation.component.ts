import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { MatSidenav } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';
import { Select, Store } from '@ngxs/store';
import { SetIsSidenavOpenStatus, SetSidenavs } from '../shared/state/ui.actions';
import { Observable } from 'rxjs';
import { UiState, UiStateModel } from '../shared/state/ui.state';
import { SettingsState, SettingsStateModel } from '../shared/state/settings.state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Select(SettingsState.getSettings) settings$: Observable<SettingsStateModel>;
  @Select(UiState.get) ui$: Observable<UiStateModel>;
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;
  fetching$: Observable<boolean>;

  constructor(
    public media$: ObservableMedia,
    public feedsService: FeedsService,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(new SetSidenavs({
      sidenav: this.sidenav,
      sidenavEnd: this.sidenavEnd
    }));

    this.fetching$ = this.settings$
      .pipe(
        map(settings => {
          return settings.feeds.filter(feed => feed.fetching).length > 0;
        })
      );
  }

  toggleSidenav(sidenav: 'start' | 'end', isOpen: boolean) {
    this.store.dispatch(new SetIsSidenavOpenStatus({
      sidenav: sidenav,
      isOpen: isOpen
    }));
  }
}
