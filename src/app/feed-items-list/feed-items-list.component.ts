import { Component, Input, OnInit } from '@angular/core';
import { FeedItemsListService } from './feed-items-list.service';
import { Jsonfeed } from '../shared/models/jsonfeed.model';
import { JsonfeedItem } from '../shared/models/jsonfeed-item.model';

@Component({
  selector: 'app-feed-items-list',
  templateUrl: './feed-items-list.component.html',
  styleUrls: ['./feed-items-list.component.css']
})
export class FeedItemsListComponent implements OnInit {
  @Input() isSidenavAlwaysOpen: boolean;
  feedItems: JsonfeedItem[];
  displayedColumns: string[] = ['title', 'date_published'];

  constructor(private feedItemsListService: FeedItemsListService) {}

  ngOnInit() {
    this.feedItemsListService.feedChanged.subscribe((newFeed: Jsonfeed) => {
      this.feedItems = newFeed.items;
    });
  }
}
