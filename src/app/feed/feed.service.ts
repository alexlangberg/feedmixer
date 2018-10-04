import { Injectable } from '@angular/core';
import { Jsonfeed } from '../shared/models/jsonfeed.model';
import { from, Observable, Subject } from 'rxjs';
import { SettingsFile } from '../shared/models/settings-file.model';
import { Feed2jsonService } from '../shared/services/feed2json/feed2json.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { JsonfeedItem } from '../shared/models/jsonfeed-item.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  feedChanged = new Subject<JsonfeedItem[]>();
  private feeds: Jsonfeed[] = [];
  private settings: SettingsFile;

  constructor(private feed2json: Feed2jsonService) {}

  getFeeds(): Observable<Jsonfeed> {
    return from(this.settings.feeds)
      .pipe(
        mergeMap((feed) => {
          return <Observable<Jsonfeed>>this.feed2json.getFeedFromUrl(feed.url);
        })
      );
  }

  saveNewFeeds(feedRequests$: Observable<Jsonfeed>): Observable<Jsonfeed> {
    return feedRequests$.pipe(tap((newFeed: Jsonfeed) => {
        const currentFeed = this.feeds.find((feed) => {
          return feed.feed_url === newFeed.feed_url;
        });

        if (currentFeed) {
          // TODO: only add if not already exists
          currentFeed.items.push(...newFeed.items);
        } else {
          this.feeds.push(newFeed);
        }
      }
    ));
  }

  updateAllFeeds() {
    this.getFeeds()
      .pipe(
        this.saveNewFeeds.bind(this)
      ).subscribe(() => {
        from(this.feeds).pipe(
          map(feed => feed.items)
        ).subscribe(result => this.feedChanged.next(result));
    });
  }

  setup(settings: SettingsFile): void {
    this.settings = settings;
    this.updateAllFeeds();
  }
}
