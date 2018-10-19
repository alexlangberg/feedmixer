import { Injectable, OnDestroy } from '@angular/core';
import { forkJoin, Observable, of, Subscription, timer } from 'rxjs';
import { SettingsFile } from '../../models/settings-file.model';
import { ApiService } from '../api/api.service';
import { catchError } from 'rxjs/operators';
import { SettingsFeed } from '../../models/settings-feed.model';
import * as moment from 'moment';
import { SettingsState, SettingsStateModel } from '../../state/settings.state';
import { Select, Store } from '@ngxs/store';
import { SetSelectedFeedItem, UpdateFeed, UpdateTags } from '../../state/feeds.actions';
import { SetSettingsFeedError, SetSettingsFeedsFetchedAt } from '../../state/settings.actions';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';

@Injectable({
  providedIn: 'root'
})
export class FeedsService implements OnDestroy {
  @Select(SettingsState.getSettings) settings$: Observable<SettingsFile>;
  private settings: SettingsStateModel;
  private autoRefresher$: Subscription;

  constructor(
    private apiService: ApiService,
    private store: Store
  ) {
    this.settings$.subscribe((settings: SettingsStateModel) => {
      if (this.settings) {
        if (settings.isAutoRefreshEnabled !== this.settings.isAutoRefreshEnabled) {
          this.toggleAutoRefresher(settings.isAutoRefreshEnabled);
        }
      }

      this.settings = settings;
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
      .filter(feed => feed.active);
      // .filter(feed => this.isTimeToClearFeedCache(feed));

    if (feedsToUpdate.length) {
      this.store.dispatch(new SetSettingsFeedsFetchedAt({
        feeds: feedsToUpdate,
        fetchedAt: new Date()
      })).subscribe(() => {
        this.fetchFeeds(feedsToUpdate);
      });
    } else {
      this.store.dispatch(new UpdateTags());
    }
  }

  private fetchFeeds(feeds: SettingsFeed[]) {
    const requests = feeds.map(feed => {
      return this.apiService
        .getFeedFromUrl(feed.url, feed.language)
        .pipe(
          catchError(error => {
            this.store.dispatch(new SetSettingsFeedError({
              url: error.url.replace(ApiService.RSS2JSON_API_URL, ''),
              message: error.message
            }));

            return of(undefined);
          })
        );
    });

    forkJoin(requests)
      .subscribe(results => {
        results.forEach(feed => {
          if (feed) {
            this.store.dispatch(new UpdateFeed({
              url: feed._feedmixer.url,
              feed: feed
            })).subscribe(() => {
              this.store.dispatch(new UpdateTags());
            });
          }
        });
      });
  }

  private isTimeToClearFeedCache(feed: SettingsFeed): boolean {
    if (feed.fetchedAt) {
      const timeDiff = moment().diff(moment(feed.fetchedAt), 'seconds');

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
      if (this.autoRefresher$) {
        this.autoRefresher$.unsubscribe();
      }

      this.autoRefresher$ = timer(
        this.settings.autoRefreshIntervalSeconds * 1000,
        this.settings.autoRefreshIntervalSeconds * 1000
      ).subscribe(() => {
        this.refreshAllFeeds();
      });
    }
  }
}
