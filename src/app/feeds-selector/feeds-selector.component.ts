import { Component, OnDestroy, OnInit } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { SettingsFeed } from '../shared/models/settings-feed.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feeds-selector',
  templateUrl: './feeds-selector.component.html',
  styleUrls: ['./feeds-selector.component.css']
})
export class FeedsSelectorComponent implements OnInit, OnDestroy {
  feeds: SettingsFeed[];
  selectedFeeds: string[];
  feedsSettingsSubscription: Subscription;

  constructor(private feedService: FeedsService) { }

  ngOnInit() {
    this.feedsSettingsSubscription = this.feedService.feedsSettingsChanged.subscribe(
      newFeeds => this.feeds = newFeeds
    );
  }

  ngOnDestroy() {
    this.feedsSettingsSubscription.unsubscribe();
  }

  optionChanged(feeds: string[]) {
    const safe = feeds.filter(v => v !== 'all');

    this.feedService.setSelectedFeeds(safe);
  }
}
