import { Component, OnInit } from '@angular/core';
import { SettingsFeed } from '../../models/settings-feed.model';
import { Observable } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material';
import { Select, Store } from '@ngxs/store';
import { SettingsState } from '../../state/settings.state';
import {
  SetAllSettingsFeedsStatus,
  SetSettingsFeedStatus
} from '../../state/settings.actions';
import { FeedsState } from '../../state/feeds.state';

@Component({
  selector: 'app-feeds-selector',
  templateUrl: './feed-selector.component.html',
  styleUrls: ['./feed-selector.component.css']
})
export class FeedSelectorComponent implements OnInit {
  @Select(SettingsState.getSettingsFeeds) feeds$: Observable<SettingsFeed[]>;
  @Select(SettingsState.getActiveFeedsUrls) activeFeedsUrls$: Observable<SettingsFeed[]>;
  @Select(FeedsState.getFeedsItemCounts) feedsCounts$: Observable<{ url: string, count: number }[]>;
  feedsCounts: { url: string, count: number }[];

  constructor(private store: Store) { }

  ngOnInit() {
    this.feedsCounts$.subscribe(counts => {
      this.feedsCounts = counts;
    });
  }

  getFeedCount(url: string) {
    if (url === 'all') {
      return this.feedsCounts.reduce((result, item) => {
        result += item.count;
        return result;
      }, 0);
    } else {
      const feed = this.feedsCounts.find(item => item.url === url);

      if (feed) {
        return feed.count;
      } else {
        return 0;
      }
    }
  }

  onOptionChangedSlider($event: MatSlideToggleChange) {
    if ($event.source.id === 'all') {
      this.store.dispatch(new SetAllSettingsFeedsStatus($event.checked));
    } else {
      this.store.dispatch(new SetSettingsFeedStatus({
        url: $event.source.id,
        active: $event.checked
      }));
    }
  }
}
