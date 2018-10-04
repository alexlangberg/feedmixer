import { Component, OnInit } from '@angular/core';
import { LayoutService } from './shared/services/layout/layout.service';
import { HttpClient } from '@angular/common/http';
import { SettingsFile } from './shared/models/settings-file.model';
import { FeedService } from './feed/feed.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  settings: SettingsFile;

  constructor(
    private http: HttpClient,
    public layout: LayoutService,
    private feedService: FeedService
  ) {}

  ngOnInit() {
    this.http.get('./../../../settings.json')
      .subscribe((result: SettingsFile) => {
        this.settings = result;
        this.feedService.setup(this.settings);
      });
  }
}
