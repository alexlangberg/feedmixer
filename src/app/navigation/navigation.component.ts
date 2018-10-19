import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { MatSidenav } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';
import { Select, Store } from '@ngxs/store';
import { SetIsSidenavOpenStatus, SetSidenavs } from '../shared/state/ui.actions';
import { Observable } from 'rxjs';
import { UiState, UiStateModel } from '../shared/state/ui.state';
import { SettingsState } from '../shared/state/settings.state';
import { SettingsFeed } from '../shared/models/settings-feed.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Select(SettingsState.getSettingsFeeds) feeds$: Observable<SettingsFeed[]>;
  @Select(UiState.get) ui$: Observable<UiStateModel>;
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;
  private feeds: SettingsFeed[];

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

    this.feeds$.subscribe(feeds => {
      this.feeds = feeds;
    });
  }

  toggleSidenav(sidenav: 'start' | 'end', isOpen: boolean) {
    this.store.dispatch(new SetIsSidenavOpenStatus({
      sidenav: sidenav,
      isOpen: isOpen
    }));
  }

  isFetching() {
    return this.feeds.filter(feed => feed.fetching).length > 0;
  }
}
