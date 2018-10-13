import { Component } from '@angular/core';
import { SettingsFeed } from '../../models/settings-feed.model';
import { Observable } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material';
import { Select, Store } from '@ngxs/store';
import { SettingsState } from '../../state/settings.state';
import { SetAllFeedsStatus, SetFeedStatus } from '../../actions/settings.actions';

@Component({
  selector: 'app-feeds-selector',
  templateUrl: './feed-selector.component.html',
  styleUrls: ['./feed-selector.component.css']
})
export class FeedSelectorComponent {
  @Select(SettingsState.getFeeds) feeds$: Observable<SettingsFeed[]>;
  @Select(SettingsState.getActiveFeedsUrls) activeFeedsUrls$: Observable<SettingsFeed[]>;

  constructor(private store: Store) { }

  onOptionChangedSlider($event: MatSlideToggleChange) {
    if ($event.source.id === 'all') {
      this.store.dispatch(new SetAllFeedsStatus($event.checked));
    } else {
      this.store.dispatch(new SetFeedStatus({
        url: $event.source.id,
        active: $event.checked
      }));
    }
  }
}
