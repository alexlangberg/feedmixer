import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { SettingsFeed } from '../shared/models/settings-feed.model';
import { Subscription } from 'rxjs';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material';

@Component({
  selector: 'app-feeds-selector',
  templateUrl: './feeds-selector.component.html',
  styleUrls: ['./feeds-selector.component.css']
})
export class FeedsSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('feedsSelector') private feedsSelector: MatSelectionList;
  @ViewChild('selectAll') private selectAll: MatListOption;
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

  onOptionChanged($event: MatSelectionListChange) {
    if ($event.option.value === 'all') {
      if ($event.option.selected) {
        this.feedService.setAllFeedsEnabled();
      } else {
        this.feedService.setAllFeedsDisabled();
      }
    } else {
      if ($event.option.selected) {
        this.feedService.setFeedEnabled($event.option.value);
      } else {
        this.feedService.setFeedDisabled($event.option.value);
      }
    }
  }
}
