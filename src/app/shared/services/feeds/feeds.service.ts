import { Injectable, OnDestroy } from '@angular/core';
import { Jsonfeed } from '../../models/jsonfeed.model';
import { from, Observable, Subject, Subscription, timer } from 'rxjs';
import { SettingsFile } from '../../models/settings-file.model';
import { Feed2jsonService } from '../feed2json/feed2json.service';
import { filter, map, mergeMap, scan, tap } from 'rxjs/operators';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';
import { SettingsFeed } from '../../models/settings-feed.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FeedsService implements OnDestroy {
  feedsSettingsChanged = new Subject<SettingsFeed[]>();
  feedChanged = new Subject<JsonfeedItem[]>();
  private feeds: Jsonfeed[] = [];
  private settings: SettingsFile;
  private autoRefresher: Subscription;

  constructor(private feed2json: Feed2jsonService) {}

  setup(settings: SettingsFile) {
    this.settings = settings;
    this.emitNewFeedSettings();
    this.refreshAllFeeds();
  }

  private emitNewFeedSettings() {
    this.feedsSettingsChanged.next(this.settings.feeds);
  }

  ngOnDestroy() {
    if (this.feedsSettingsChanged) {
      this.feedsSettingsChanged.unsubscribe();
    }

    if (this.autoRefresher) {
      this.autoRefresher.unsubscribe();
    }
  }

  getSettingsFeed(url: string) {
    return this.settings.feeds.find(feed => feed.url === url);
  }

  getActiveFeeds(): SettingsFeed[] {
    return this.settings.feeds.filter(feed => feed.active);
  }

  setFeedEnabled(url: string) {
    const feed = this.getSettingsFeed(url);

    if (feed) {
      feed.active = true;
      this.emitNewFeedSettings();
      this.refreshFeed(url);
    }
  }

  setAllFeedsEnabled() {
    this.settings.feeds.forEach(feed => this.setFeedEnabled(feed.url));
  }

  setAllFeedsDisabled() {
    this.settings.feeds.forEach(feed => this.setFeedDisabled(feed.url));
  }

  setFeedDisabled(url: string) {
    const feed = this.getSettingsFeed(url);

    if (feed) {
      feed.active = false;
      this.emitNewFeedSettings();
      this.emitNewFeedMix();
    }
  }

  isFeedActive(url: string): boolean {
    const feed = this.getSettingsFeed(url);

    if (feed) {
      return feed.active;
    } else {
      return false;
    }
  }

  toggleAutoRefresher(state: boolean) {
    if (!state) {
      if (this.autoRefresher) {
        this.autoRefresher.unsubscribe();
      }
    } else {
      this.autoRefresher = timer(
        0,
        this.settings.autoRefreshIntervalMinutes * 60000
      ).subscribe(() => {
        this.refreshAllFeeds();
      });
    }
  }

  private sortByDate(a: JsonfeedItem, b: JsonfeedItem) {
    return new Date(b.date_published || 0).getTime()
      - new Date(a.date_published || 0).getTime();
  }

  private fetchFeed(url: string): Observable<Jsonfeed> {
    const feed = this.getSettingsFeed(url);

    if (feed) {
      feed.lastUpdated = new Date();
    }

    return from(this.feed2json.getFeedFromUrl(url));
  }

  private fetchActiveFeeds(): Observable<Jsonfeed> {
    const feeds = this.getActiveFeeds();

    return from(feeds)
      .pipe(
        mergeMap((feed) => {
          return this.fetchFeed(feed.url);
        })
      );
  }

  private saveNewFeeds(feedRequests$: Observable<Jsonfeed>): Observable<Jsonfeed> {
    return feedRequests$.pipe(tap((newFeed: Jsonfeed) => {
        const oldFeed = this.feeds.find((feed) => {
          return feed._feedmixer.url === newFeed._feedmixer.url;
        });

        if (oldFeed) {
          newFeed.items.forEach(newItem => {
            const oldItem = oldFeed.items.find(
              item => item.guid === newItem.guid
            );

            if (! oldItem) {
              oldFeed.items.push(newItem);
            }
          });
        } else {
          this.feeds.push(newFeed);
        }
      }
    ));
  }

  private isTimeToClearFeedCache(url: string): boolean {
    const feed = this.getSettingsFeed(url);

    if (feed) {
      const timeDiff = moment().diff(moment(feed.lastUpdated), 'seconds');

      return timeDiff > this.settings.cacheFeedsSeconds;
    } else {
      return true;
    }
  }

  refreshFeed(url: string, useCache: boolean = true) {
    if (useCache) {
      if (this.isTimeToClearFeedCache(url)) {
        this.fetchFeed(url).pipe(this.saveAndEmitFeeds.bind(this));
      } else {
        this.emitNewFeedMix();
      }
    } else {
      this.fetchFeed(url).pipe(this.saveAndEmitFeeds.bind(this));
    }
  }

  refreshAllFeeds() {
    this.fetchActiveFeeds().pipe(this.saveAndEmitFeeds.bind(this));
  }

  private saveAndEmitFeeds(feedRequests$: Observable<Jsonfeed>) {
    feedRequests$.pipe(
      this.saveNewFeeds.bind(this)
    ).subscribe(() => {
      this.emitNewFeedMix();
    });
  }

  private emitNewFeedMix() {
    if (!this.getActiveFeeds().length) {
      this.feedChanged.next([]);
      return;
    }

    from(this.feeds).pipe(
      filter(feed => this.isFeedActive(feed._feedmixer.url)),
      map(feed => feed.items),
      scan((acc: JsonfeedItem[], curr: JsonfeedItem[]) => {
          acc.push(...curr);
          return acc;
        },
        []
      ),
      map(items => items.sort(this.sortByDate))
    ).subscribe(result => {
      this.feedChanged.next(result);
    });
  }
}
