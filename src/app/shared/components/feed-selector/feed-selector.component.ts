import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FeedsService } from '../../services/feeds/feeds.service';
import { SettingsFeed } from '../../models/settings-feed.model';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-feeds-selector',
  templateUrl: './feed-selector.component.html',
  styleUrls: ['./feed-selector.component.css']
})
export class FeedSelectorComponent implements OnInit, OnDestroy {
  settingsFeeds: SettingsFeed[] = [];
  selectedFeedsByUrl: string[] = [];
  feedsSettingsSubscription: Subscription;

  constructor(private feedService: FeedsService) { }

  ngOnInit() {
    this.feedsSettingsSubscription = this.feedService.feedsSettingsChanged$.subscribe(
      newFeeds => {
        this.settingsFeeds = newFeeds;
        this.markSelectedOptions();
      }
    );
  }

  ngOnDestroy() {
    this.feedsSettingsSubscription.unsubscribe();
  }

  markSelectedOptions() {
    this.selectedFeedsByUrl = this.settingsFeeds
      .filter(feed => feed.active)
      .map(feed => feed.url);

    if (this.settingsFeeds.length === this.selectedFeedsByUrl.length) {
      this.selectedFeedsByUrl.push('all');
    }
  }

  onOptionChangedSlider($event: MatSlideToggleChange) {
    console.log($event);
    if ($event.source.id === 'all') {
      if ($event.checked) {
        this.feedService.setAllFeedsEnabled();
      } else {
        this.feedService.setAllFeedsDisabled();
      }
    } else {
      if ($event.checked) {
        this.feedService.setFeedEnabled($event.source.id);
      } else {
        this.feedService.setFeedDisabled($event.source.id);
      }
    }
  }
}
