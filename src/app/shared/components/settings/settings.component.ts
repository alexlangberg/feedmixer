import { Component, OnInit } from '@angular/core';
import { FeedsService } from '../../services/feeds/feeds.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private feedsService: FeedsService) { }

  ngOnInit() {
  }

  onAutoRefreshToggle($event: boolean) {
    this.feedsService.toggleAutoRefresher($event);
  }
}
