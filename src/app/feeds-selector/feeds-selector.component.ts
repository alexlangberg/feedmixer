import { Component, Input, OnInit } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';

@Component({
  selector: 'app-feeds-selector',
  templateUrl: './feeds-selector.component.html',
  styleUrls: ['./feeds-selector.component.css']
})
export class FeedsSelectorComponent implements OnInit {
  @Input() refresh: void;
  @Input() autoRefresh = false;

  constructor(private feedService: FeedsService) { }

  ngOnInit() {
  }

  doRefresh() {
    this.feedService.refreshFeeds();
  }

  toggleAutoRefresher(state: boolean) {
    this.feedService.toggleAutoRefresher(state);
  }
}
