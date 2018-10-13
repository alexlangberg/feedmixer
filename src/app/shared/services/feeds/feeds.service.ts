import { Injectable, OnDestroy } from '@angular/core';
import { from, Observable, Subscription, timer } from 'rxjs';
import { SettingsFile } from '../../models/settings-file.model';
import { ApiService } from '../api/api.service';
import { mergeMap } from 'rxjs/operators';
import { SettingsFeed } from '../../models/settings-feed.model';
import * as moment from 'moment';
import { SettingsState } from '../../state/settings.state';
import { Select, Store } from '@ngxs/store';
import { UpdateFeed } from '../../actions/feeds.actions';
import { SetSettingsFeedsUpdatedAt } from '../../actions/settings.actions';

@Injectable({
  providedIn: 'root'
})
export class FeedsService implements OnDestroy {
  @Select(SettingsState.getSettings) settings$: Observable<SettingsFile>;
  private settings: SettingsFile;

  // feedChanged$ = new Subject<Jsonfeed>();
  // feedMixChanged$ = new Subject<JsonfeedItem[]>();
  private autoRefresher$: Subscription;
  // private feeds: Jsonfeed[] = [];

  constructor(
    private apiService: ApiService,
    private store: Store
  ) {
      this.settings$.subscribe(settings => {
        this.settings = settings;
        this.ngxsFetchEnabledFeeds(settings.feeds);
        // this.refreshAllFeeds();
        // this.emitNewFeedMix();
    });
  }

  // static sortByDate(a: JsonfeedItem, b: JsonfeedItem) {
  //   return new Date(b.date_published || 0).getTime()
  //     - new Date(a.date_published || 0).getTime();
  // }

  ngxsFetchEnabledFeeds(feeds: SettingsFeed[]) {
    const feedsToUpdate = feeds
      .filter(feed => feed.active)
      .filter(feed => this.ngxsIsTimeToClearFeedCache(feed));

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

  private ngxsIsTimeToClearFeedCache(feed: SettingsFeed): boolean {
    if (feed.updatedAt) {
      const timeDiff = moment().diff(moment(feed.updatedAt), 'seconds');

      return timeDiff > this.settings.cacheFeedsSeconds;
    } else {
      return true;
    }
  }

  ngxsRefreshAllFeeds() {
    this.ngxsFetchEnabledFeeds(this.settings.feeds);
  }

  ngOnDestroy() {
    // if (this.feedChanged$) {
    //   this.feedChanged$.unsubscribe();
    // }
    //
    // if (this.feedMixChanged$) {
    //   this.feedMixChanged$.unsubscribe();
    // }

    if (this.autoRefresher$) {
      this.autoRefresher$.unsubscribe();
    }
  }

  // getFeedItem(url: string): JsonfeedItem | undefined {
  //   return this.feeds
  //     .map(feed => feed.items)
  //     .reduce((acc, val) => acc.concat(val))
  //     .find(item => item.url === url);
  // }

  // getSettingsFeed(url: string) {
  //   return this.settings.feeds.find(feed => feed.url === url);
  // }
  //
  // getActiveFeeds(): SettingsFeed[] {
  //   return this.settings.feeds.filter(feed => feed.active);
  // }

  // isFeedActive(url: string): boolean {
  //   const feed = this.getSettingsFeed(url);
  //
  //   if (feed) {
  //     return feed.active;
  //   } else {
  //     return false;
  //   }
  // }

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
        this.ngxsRefreshAllFeeds();
      });
    }
  }

  // private fetchFeed(url: string): Observable<Jsonfeed> {
  //   const feed = this.getSettingsFeed(url);
  //
  //   if (feed) {
  //     feed.lastUpdated = new Date();
  //   }
  //
  //   return from(this.apiService.getFeedFromUrl(url));
  // }

  // private fetchActiveFeeds(): Observable<Jsonfeed> {
  //   const feeds = this.getActiveFeeds();
  //
  //   return from(feeds)
  //     .pipe(
  //       mergeMap((feed) => {
  //         return this.fetchFeed(feed.url);
  //       })
  //     );
  // }

  // private saveNewFeeds(feedRequests$: Observable<Jsonfeed>): Observable<Jsonfeed> {
  //   return feedRequests$.pipe(tap((newFeed: Jsonfeed) => {
  //       const oldFeed = this.feeds.find((feed) => {
  //         return feed._feedmixer.url === newFeed._feedmixer.url;
  //       });
  //
  //       if (oldFeed) {
  //         newFeed.items.forEach(newItem => {
  //           const oldItem = oldFeed.items.find(
  //             item => item.guid === newItem.guid
  //           );
  //
  //           if (! oldItem) {
  //             oldFeed.items.push(newItem);
  //           }
  //         });
  //
  //         this.feedChanged$.next(oldFeed);
  //       } else {
  //         const settingsFeed = this.getSettingsFeed(newFeed._feedmixer.url);
  //
  //         if (settingsFeed) {
  //           newFeed._feedmixer.language = settingsFeed.language;
  //         }
  //
  //         this.feeds.push(newFeed);
  //         this.feedChanged$.next(newFeed);
  //       }
  //     }
  //   ));
  // }

  // private isTimeToClearFeedCache(url: string): boolean {
  //   const feed = this.getSettingsFeed(url);
  //
  //   if (feed) {
  //     const timeDiff = moment().diff(moment(feed.lastUpdated), 'seconds');
  //
  //     return timeDiff > this.settings.cacheFeedsSeconds;
  //   } else {
  //     return true;
  //   }
  // }

  // refreshFeed(url: string, useCache: boolean = true) {
  //   if (useCache) {
  //     if (this.isTimeToClearFeedCache(url)) {
  //       this.fetchFeed(url).pipe(this.saveAndEmitFeeds.bind(this));
  //     } else {
  //       this.emitNewFeedMix();
  //     }
  //   } else {
  //     this.fetchFeed(url).pipe(this.saveAndEmitFeeds.bind(this));
  //   }
  // }

  // private saveAndEmitFeeds(feedRequests$: Observable<Jsonfeed>) {
  //   feedRequests$.pipe(
  //     this.saveNewFeeds.bind(this)
  //   ).subscribe(() => {
  //     this.emitNewFeedMix();
  //   });
  // }

  // private emitNewFeedMix() {
  //   if (!this.getActiveFeeds().length) {
  //     this.feedMixChanged$.next([]);
  //     return;
  //   }
  //
  //   from(this.feeds).pipe(
  //     filter(feed => this.isFeedActive(feed._feedmixer.url)),
  //     map(feed => feed.items),
  //     scan((acc: JsonfeedItem[], curr: JsonfeedItem[]) => {
  //         acc.push(...curr);
  //         return acc;
  //       },
  //       []
  //     ),
  //     map(items => items.sort(FeedsService.sortByDate))
  //   ).subscribe(result => {
  //     this.feedMixChanged$.next(result);
  //   });
  // }
}
