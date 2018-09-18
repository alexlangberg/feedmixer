import { Component, OnInit } from '@angular/core';
import { FeedItemsListService } from './feed-items-list.service';
import { Jsonfeed } from '../shared/models/jsonfeed.model';
import { JsonfeedItem } from '../shared/models/jsonfeed-item.model';

@Component({
  selector: 'app-feed-items-list',
  templateUrl: './feed-items-list.component.html',
  styleUrls: ['./feed-items-list.component.css']
})
export class FeedItemsListComponent implements OnInit {
  public feed: Jsonfeed;

  constructor(private feedItemsListService: FeedItemsListService) {}

  ngOnInit() {
    this.feed = new Jsonfeed(
      '1',
      'Testpost',
      [new JsonfeedItem('id1')]
    );

    this.feedItemsListService.feedChanged.subscribe((newFeed: Jsonfeed) => {
      this.feed = newFeed;
    });
  }
}
