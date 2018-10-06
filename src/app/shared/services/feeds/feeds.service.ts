import { Injectable, OnDestroy } from '@angular/core';
import { Jsonfeed } from '../../models/jsonfeed.model';
import { from, Observable, Subject, Subscription, timer } from 'rxjs';
import { SettingsFile } from '../../models/settings-file.model';
import { Feed2jsonService } from '../feed2json/feed2json.service';
import { filter, map, mergeMap, scan, tap } from 'rxjs/operators';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';
import { SettingsFeed } from '../../models/settings-feed.model';

@Injectable({
  providedIn: 'root'
})
export class FeedsService implements OnDestroy {
  feedsSettingsChanged = new Subject<SettingsFeed[]>();
  feedChanged = new Subject<JsonfeedItem[]>();
  private feeds: Jsonfeed[] = [];
  private selectedFeeds: string[] = [];
  private settings: SettingsFile;
  private autoRefresher: Subscription;

  constructor(private feed2json: Feed2jsonService) {}

  setup(settings: SettingsFile) {
    this.settings = settings;
    // this.selectedFeeds = settings.feeds.map(feed => feed.url);
    this.feedsSettingsChanged.next(settings.feeds);
    this.refreshFeeds();
  }

  ngOnDestroy() {
    if (this.feedsSettingsChanged) {
      this.feedsSettingsChanged.unsubscribe();
    }

    if (this.autoRefresher) {
      this.autoRefresher.unsubscribe();
    }
  }

  setSelectedFeeds(feeds: string[]) {
    this.selectedFeeds = feeds;
    console.log(feeds);
    this.refreshFeeds();
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
        this.refreshFeeds();
      });
    }
  }

  private sortByDate(a: JsonfeedItem, b: JsonfeedItem) {
    return new Date(b.date_published || 0).getTime()
      - new Date(a.date_published || 0).getTime();
  }

  fetchFeeds(): Observable<Jsonfeed> {
    return from(this.selectedFeeds)
      .pipe(
        mergeMap((feed) => {
          return this.feed2json.getFeedFromUrl(feed);
        })
      );
  }

  saveNewFeeds(feedRequests$: Observable<Jsonfeed>): Observable<Jsonfeed> {
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

  refreshFeeds() {
    if (this.selectedFeeds.length === 0) {
      this.feedChanged.next([]);
      return;
    }

    this.fetchFeeds()
      .pipe(
        this.saveNewFeeds.bind(this)
      ).subscribe(() => {
        from(this.feeds).pipe(
          filter(feed => this.selectedFeeds.includes(feed._feedmixer.url)),
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
    });
  }
}
