import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsFile } from './shared/models/settings-file.model';
import { FeedsService } from './shared/services/feeds/feeds.service';
import { Store } from '@ngxs/store';
import { UpdateSettingsFromFile } from './shared/state/settings.actions';
import { SettingsStateModel } from './shared/state/settings.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private feedService: FeedsService,
    private store: Store
  ) {}

  ngOnInit() {
    this.fetchSettings();
  }

  fetchSettings() {
    this.http.get('./assets/settings.json')
      .subscribe((result: SettingsFile) => {
        result.feeds = result.feeds
          .map(feed => ({...feed, active: true}))
          .sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, {sensitivity: 'base'});
          });

        this.store.dispatch(new UpdateSettingsFromFile(<SettingsStateModel>result))
          .subscribe(() => {
            this.feedService.refreshAllFeeds();
          });
      });
  }
}
