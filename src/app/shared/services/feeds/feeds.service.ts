import { Injectable, OnDestroy } from '@angular/core';
import { Jsonfeed } from '../../models/jsonfeed.model';
import { from, Observable, Subject, Subscription, timer } from 'rxjs';
import { SettingsFile } from '../../models/settings-file.model';
import { Feed2jsonService } from '../feed2json/feed2json.service';
import { map, mergeMap, scan, tap } from 'rxjs/operators';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';
import { SettingsFeed } from '../../models/settings-feed.model';

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

  toggleFeed(settings: SettingsFeed, state: boolean) {
    const oldFeed = this.settings.feeds.find(item => item.url === settings.url);

    if (oldFeed) {
      oldFeed.active = state;
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
        this.refreshFeeds();
      });
    }
  }

  private sortByDate(a: JsonfeedItem, b: JsonfeedItem) {
    return new Date(b.date_published || 0).getTime()
      - new Date(a.date_published || 0).getTime();
  }

  fetchFeeds(): Observable<Jsonfeed> {
    return from(this.settings.feeds)
      .pipe(
        mergeMap((feed) => {
          return <Observable<Jsonfeed>>this.feed2json.getFeedFromUrl(feed.url);
        })
      );
  }

  saveNewFeeds(feedRequests$: Observable<Jsonfeed>): Observable<Jsonfeed> {
    return feedRequests$.pipe(tap((newFeed: Jsonfeed) => {
        const oldFeed = this.feeds.find((feed) => {
          return feed.home_page_url === newFeed.home_page_url;
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
    this.fetchFeeds()
      .pipe(
        this.saveNewFeeds.bind(this)
      ).subscribe(() => {
        from(this.feeds).pipe(
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
