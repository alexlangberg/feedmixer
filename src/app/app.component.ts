import { Component, OnInit } from '@angular/core';
import { Feed2jsonService } from './shared/services/feed2json/feed2json.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  feed_url = 'http://feeds.bbci.co.uk/news/rss.xml';
  title = 'feedmixer';

  constructor(private feed2json: Feed2jsonService) {}

  getFeed() {
    this.feed2json.getFeed(this.feed_url);
  }

  ngOnInit() {
    this.getFeed();
  }
}
