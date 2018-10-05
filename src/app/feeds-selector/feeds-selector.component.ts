import { Component, OnInit } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { SettingsFeed } from '../shared/models/settings-feed.model';

@Component({
  selector: 'app-feeds-selector',
  templateUrl: './feeds-selector.component.html',
  styleUrls: ['./feeds-selector.component.css']
})
export class FeedsSelectorComponent implements OnInit {
  feeds: SettingsFeed[];

  constructor(private feedService: FeedsService) { }

  ngOnInit() {
    this.feedService.feedsSettingsChanged.subscribe(
      newFeeds => this.feeds = newFeeds
    );
  }
}
