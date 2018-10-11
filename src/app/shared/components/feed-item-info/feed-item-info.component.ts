import { Component, Input, OnInit } from '@angular/core';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';

@Component({
  selector: 'app-feed-item-info',
  templateUrl: './feed-item-info.component.html',
  styleUrls: ['./feed-item-info.component.css']
})
export class FeedItemInfoComponent implements OnInit {
  @Input() item: JsonfeedItem;

  constructor() { }

  ngOnInit() {
  }

}
