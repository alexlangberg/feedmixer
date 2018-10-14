import { Component } from '@angular/core';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';
import { Select } from '@ngxs/store';
import { FeedsState } from '../../state/feeds.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-feed-item-info',
  templateUrl: './feed-item-info.component.html',
  styleUrls: ['./feed-item-info.component.css']
})
export class FeedItemInfoComponent {
  @Select(FeedsState.getSelectedFeedItem) item$: Observable<JsonfeedItem>;
  item: JsonfeedItem;

  constructor() {
    this.item$.subscribe(item => {
      this.item = item;
    });
  }
}
