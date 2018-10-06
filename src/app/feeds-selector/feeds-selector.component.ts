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
  feeds: SettingsFeed[] = [];
  selectedFeeds: SettingsFeed[] = [];
  feedsSettingsSubscription: Subscription;

  constructor(private feedService: FeedsService) { }

  ngOnInit() {
    this.feedsSettingsSubscription = this.feedService.feedsSettingsChanged.subscribe(
      newFeeds => {
        this.feeds = newFeeds;

        if (this.selectedFeeds.length < 1) {
          this.selectedFeeds = newFeeds;
          this.optionChanged();
        }
      }
    );
  }

  ngOnDestroy() {
    this.feedsSettingsSubscription.unsubscribe();
  }

  optionChanged() {
    this.feedService.setSelectedFeeds(this.selectedFeeds);
  }
}
