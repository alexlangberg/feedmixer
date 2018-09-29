import { Component, OnInit } from '@angular/core';
import { Feed2jsonService } from './shared/services/feed2json/feed2json.service';
import { LayoutService } from './shared/services/layout/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  feedUrl = 'http://feeds.bbci.co.uk/news/rss.xml';
  title = 'feedmixer';

  constructor(
    private feed2json: Feed2jsonService,
    public layout: LayoutService
  ) {}

  getFeed() {
    this.feed2json.getFeed(this.feedUrl);
  }

  ngOnInit() {
    this.getFeed();
  }
}
