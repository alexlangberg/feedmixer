import { Injectable, OnDestroy } from '@angular/core';
import { from, Observable, Subscription, timer } from 'rxjs';
import { SettingsFile } from '../../models/settings-file.model';
import { ApiService } from '../api/api.service';
import { mergeMap } from 'rxjs/operators';
import { SettingsFeed } from '../../models/settings-feed.model';
import * as moment from 'moment';
import { SettingsState } from '../../state/settings.state';
import { Select, Store } from '@ngxs/store';
import { SetSelectedFeedItem, UpdateFeed } from '../../actions/feeds.actions';
import { SetSettingsFeedsUpdatedAt } from '../../actions/settings.actions';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';

@Injectable({
  providedIn: 'root'
})
export class FeedsService implements OnDestroy {
  @Select(SettingsState.getSettings) settings$: Observable<SettingsFile>;
  private settings: SettingsFile;
  private autoRefresher$: Subscription;

  constructor(
    private apiService: ApiService,
    private store: Store
  ) {
      this.settings$.subscribe(settings => {
        this.settings = settings;
        this.fetchEnabledFeeds(settings.feeds);
    });
  }

  ngOnDestroy() {
    if (this.autoRefresher$) {
      this.autoRefresher$.unsubscribe();
    }
  }

  setSelectedFeedItem(feedItem: JsonfeedItem) {
    this.store.dispatch(new SetSelectedFeedItem({ feedItem }));
  }

  refreshAllFeeds() {
    this.fetchEnabledFeeds(this.settings.feeds);
  }

  fetchEnabledFeeds(feeds: SettingsFeed[]) {
    const feedsToUpdate = feeds
      .filter(feed => feed.active)
      .filter(feed => this.isTimeToClearFeedCache(feed));

    if (feedsToUpdate.length) {
      this.store.dispatch(new SetSettingsFeedsUpdatedAt({
        feeds: feedsToUpdate,
        updatedAt: new Date()
      })).subscribe(() => {
        from(feedsToUpdate)
          .pipe(
            mergeMap(feed => this.apiService.getFeedFromUrl(feed.url))
          )
          .subscribe(feed => {
            this.store.dispatch(new UpdateFeed({
              url: feed._feedmixer.url,
              feed: feed
            }));
          });
      });
    }
  }

  private isTimeToClearFeedCache(feed: SettingsFeed): boolean {
    if (feed.updatedAt) {
      const timeDiff = moment().diff(moment(feed.updatedAt), 'seconds');

      return timeDiff > this.settings.cacheFeedsSeconds;
    } else {
      return true;
    }
  }

  toggleAutoRefresher(state: boolean) {
    if (!state) {
      if (this.autoRefresher$) {
        this.autoRefresher$.unsubscribe();
      }
    } else {
      this.autoRefresher$ = timer(
        0,
        this.settings.autoRefreshIntervalMinutes * 60000
      ).subscribe(() => {
        this.refreshAllFeeds();
      });
    }
  }
}
