import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsFile } from './shared/models/settings-file.model';
import { FeedsService } from './shared/services/feeds/feeds.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  settings: SettingsFile;

  constructor(
    private http: HttpClient,
    private feedService: FeedsService
  ) {}

  ngOnInit() {
    this.http.get('./../../../settings.json')
      .subscribe((result: SettingsFile) => {
        result.feeds = result.feeds
          .map(feed => ({...feed, active: true}))
          .sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, {sensitivity: 'base'});
          });

        this.settings = result;

        this.feedService.setup(this.settings);
      });
  }
}
