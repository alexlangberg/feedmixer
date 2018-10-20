import { Injectable, OnDestroy } from '@angular/core';
import { forkJoin, Observable, of, Subject, Subscription, timer } from 'rxjs';
import { SettingsFile } from '../../models/settings-file.model';
import { ApiService } from '../api/api.service';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { SettingsFeed } from '../../models/settings-feed.model';
import { SettingsState, SettingsStateModel } from '../../state/settings.state';
import { Select, Store } from '@ngxs/store';
import { SetSelectedFeedItem, UpdateFeeds, UpdateTags } from '../../state/feeds.actions';
import {
  SetSettingsFeedError,
  SetSettingsFeedFetching,
  SetSettingsFeedsFetchedAt, SetSettingsFeedsFetching
} from '../../state/settings.actions';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';
import { Jsonfeed } from '../../models/jsonfeed.model';

@Injectable({
  providedIn: 'root'
})
export class FeedsService implements OnDestroy {
  @Select(SettingsState.getSettings) settings$: Observable<SettingsFile>;
  private settings: SettingsStateModel;
  private autoRefresher$: Subscription;
  private allFetchUnsubscribe$ = new Subject();

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

    if (this.allFetchUnsubscribe$) {
      this.allFetchUnsubscribe$.unsubscribe();
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
    this.store.dispatch(new SetSettingsFeedsFetching({
      fetching: true
    }));

    const requests = feeds.map(feed => {
      return this.apiService
        .getFeedFromUrl(feed.url, feed.language)
        .pipe(
          tap(item => {
            this.store.dispatch(new SetSettingsFeedFetching({
              url: item._feedmixer.url,
              fetching: false
            }));
          }),
          catchError(error => {

            // also sets feed.fetching = false
            this.store.dispatch(new SetSettingsFeedError({
              url: error.url.replace(ApiService.RSS2JSON_API_URL, ''),
              message: error.message
            }));

            return of(undefined);
          })
        );
    });

    forkJoin(requests)
      .pipe(
        takeUntil(this.allFetchUnsubscribe$),
        map(results => {
          return results.filter(result => result !== undefined);
        })
      )
      .subscribe((results: Jsonfeed[]) => {
        if (results && results.length) {
          this.store
            .dispatch(new UpdateFeeds({ feeds: results.slice() }))
            .subscribe(() => {
              this.store.dispatch(new UpdateTags());
            });
        }
      });
  }

  cancelFetching() {
    this.allFetchUnsubscribe$.next();
    this.store.dispatch(new SetSettingsFeedsFetching({
      fetching: false
    }));
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
