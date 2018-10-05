import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from './shared/services/layout/layout.service';
import { HttpClient } from '@angular/common/http';
import { SettingsFile } from './shared/models/settings-file.model';
import { FeedsService } from './shared/services/feeds/feeds.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  settings: SettingsFile;

  constructor(
    private http: HttpClient,
    public layout: LayoutService,
    private feedService: FeedsService
  ) {}

  ngOnInit() {
    this.layout.sidenav = this.sidenav;
    this.http.get('./../../../settings.json')
      .subscribe((result: SettingsFile) => {
        result.feeds = result.feeds.map(feed => ({...feed, active: true}));

        this.settings = result;

        this.feedService.setup(this.settings);
      });
  }
}
