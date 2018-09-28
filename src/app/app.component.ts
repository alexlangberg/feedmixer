import { Component, OnDestroy, OnInit } from '@angular/core';
import { Feed2jsonService } from './shared/services/feed2json/feed2json.service';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  feedUrl = 'http://feeds.bbci.co.uk/news/rss.xml';
  title = 'feedmixer';
  screenSize: string;
  isSidenavOpen: boolean;
  isSidenavAlwaysOpen: boolean;
  sidenavPosition: string;
  toolbarHeight: number;
  private readonly mediaWatcher: Subscription;

  constructor(
    private feed2json: Feed2jsonService,
    private media$: ObservableMedia) {
      this.mediaWatcher = media$.subscribe((change: MediaChange) => {
        this.screenSize = change.mqAlias;

        if (['xs'].includes(this.screenSize)) {
          this.toolbarHeight = 56;
        } else {
          this.toolbarHeight = 64;
        }

        if (['xs', 'sm'].includes(this.screenSize)) {
          this.isSidenavOpen = false;
          this.sidenavPosition = 'over';
          this.isSidenavAlwaysOpen = false;
        } else {
          this.isSidenavOpen = true;
          this.sidenavPosition = 'side';
          this.isSidenavAlwaysOpen = true;
        }
      });
  }

  getFeed() {
    this.feed2json.getFeed(this.feedUrl);
  }

  ngOnInit() {
    this.getFeed();
  }

  ngOnDestroy() {
    if (this.mediaWatcher) {
      this.mediaWatcher.unsubscribe();
    }
  }
}
